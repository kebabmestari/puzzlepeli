/**
 * Base class for all game objects
 * Created by Samuel on 3/23/2016.
 */

'use strict';

//Container for all animations
var animations = [];

//Objects moving speed
var OBJMOVESPEED = 5;

//Boxes required for finish
var requiredBoxes = 0, boxesAtGoals = 0;

/**
 * Base class constructor
 * @param {string} name Name/type of the object
 * @param {number} x X coordinate in tiles
 * @param {number} y Y coordinate in tiles
 * @param {color} color Placeholder background color
 * @param {string} char Placeholder character
 * @param {string} img Image element ID
 */
function gameObject(name, x, y, color, char, img) {

    //Object name
    this.name = name;

    //Image dimensions and object position
    this.x = x;
    this.y = y;

    this.imgW = 0;
    this.imgH = 0;

    //Offsets, used for animation and such, doesn't affect object's real position tho
    this.drawOffsetX = 0;
    this.drawOffsetY = 0;

    //Color
    this.color = color;

    //Object animation
    this.isAnimated = false;
    this.animation = null;
    this.animationFrame = 0;
    this.animationTick = Date.now();

    //Object moving variables
    this.isMoving = false;
    this.targetX = 0;
    this.targetY = 0;
    this.moveDir = '';
    
    //If flag is true the object will be destroyed when it's movement is complete
    this.destroyAtEnd = false;

    //Placeholder character
    this.char = (typeof char === 'string' && char.length === 1) ?char:'?';

    //Load image element
    this.img = document.getElementById(img) || null;
    if(this.img){
        this.imgW = img.width;
        this.imgH = img.height;
    }

    console.log("Game object " + name + " created at " + x + "," + y);
}

//Are this object and the given object touching
gameObject.prototype.isColliding = function(obj){
    if(typeof obj !== 'object')
        throw 'Invalid object given to isColliding';
    if(this.x === obj.x && this.y === obj.y)
        return true;
    else
        return false;
};

//Set animation for this object
gameObject.prototype.setAnimation = function(anim){
    if(typeof anim === 'string'){
        var l = window.animations.length;
        for(var i = 0; i < l; i++){
            if(window.animations[i].name === anim){
                this.isAnimated = true;
                this.animation = window.animations[i];
                return;
            }
        }
    }else if(anim instanceof animation){
        this.isAnimated = true;
        this.animation = anim;
    }
};

//Update smooth movement of the object
gameObject.prototype.updateMovement = function(){
    if(this.isMoving){
        if(this.targetX > this.x){
            this.drawOffsetX += window.OBJMOVESPEED;
        }else if(this.targetX < this.x){
            this.drawOffsetX -= window.OBJMOVESPEED;
        }
        if(this.targetY > this.y){
            this.drawOffsetY += window.OBJMOVESPEED;
        }else if(this.targetY < this.y){
            this.drawOffsetY -= window.OBJMOVESPEED;
        }

        var tileW = currentMap.tileset.tileW;
        var tileH = currentMap.tileset.tileH;

        //Check if the object has reached it's destination
        if(Math.abs((this.targetX*tileW - (this.x*tileW+this.drawOffsetX))) <= window.OBJMOVESPEED &&
           Math.abs((this.targetY*tileH - (this.y*tileH+this.drawOffsetY))) <= window.OBJMOVESPEED){
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
            this.drawOffsetX = 0;
            this.drawOffsetY = 0;
            //Destroy object if it is wished so
            //Boxes hit water etc
            this.checkDestroyAtEnd();
        }
    }
};

/**
 * Check if the object should be destroyed at the end of its
 * moveset and removes it if so
 */
gameObject.prototype.checkDestroyAtEnd = function(){
    if(this.destroyAtEnd){
        currentMap.removeObject(this);
    }
}

/**
 * Check if there are other objects on the way
 * @param {number} x
 * @param {number} y
 * @returns {Boolean} True if way is clear
 */
gameObject.prototype.canMoveTo = function(x, y){

    //Doesn't affect the player!
    if(this.name === 'player')
        return true;

    var l = currentMap.objects.length;
    for(var i = 0; i < l; i++){
        var tempObj = currentMap.objects[i];
        if((tempObj !== this) && (tempObj.x === x && tempObj.y === y)){
            return false;
        }
    }
    return true;
};

/**
 * Set the object into a move
 * @param {string} dir direction into which move the object
 */
gameObject.prototype.move = function(dir){
    
    //Prevent moving if game is paused
    if(!window.gameOn)
        return;
    
    switch (dir.toLowerCase()) {
        case 'up':
            this.isMoving = true;
            this.targetX = this.x;
            this.targetY = this.y - 1;
            break;
        case 'right':
            this.isMoving = true;
            this.targetY = this.y;
            this.targetX = this.x + 1;
            break;
        case 'down':
            this.isMoving = true;
            this.targetX = this.x;
            this.targetY = this.y + 1;
            break;
        case 'left':
            this.isMoving = true;
            this.targetY = this.y;
            this.targetX = this.x - 1;
            break;
        default:
            // statements_def
            break;
    }
    
    //If enemy can move boxes handle them
    if(this.name === 'enemy'){
        if(this.moveBoxes())
            return;
    }
    
    //Check for walls
    if(currentMap.isHit(this.targetX, this.targetY) || !this.canMoveTo(this.targetX, this.targetY)){
        //Player collision with doors etc
        if(this.name === 'player' && !this.checkWallCollision(this.targetX, this.targetY))
            return;
        //Box collision with water etc
        if(this.name === 'box' && !this.checkSpecialCollision(this.targetX, this.targetY))
            return;
        this.isMoving = false;
        this.targetX = this.x;
        this.targetY = this.y;
        //Enemy collision to walls and turning
        if(this.name === 'enemy'){
            this.handleWallTurning();
            return;
        }
    }
    if(this.isMoving) this.moveDir = dir;
};

//Check time and update animation if needed
gameObject.prototype.updateAnimation = function(){
    if((Date.now() - +this.animationTick) >= this.animation.speed){
        this.updateFrame();
        this.animationTick = Date.now();
    }
};

//Go to next frame
gameObject.prototype.updateFrame = function(){
    this.animationFrame++;
    if(this.animationFrame >= this.animation.frames){
        this.animationFrame = 0;
    }
};

//Stop animation
gameObject.prototype.stopAnimation = function(){
    this.isAnimated = false;
};

//Set object position
gameObject.prototype.setPosition = function(x, y){
    if(!currentMap){
        this.x = x; this.y = y;
        return;
    }
    if(x >= 0 && x < currentMap.mapW && y >= 0 && y < currentMap.mapH){
        this.x = x; this.y = y;
    }
    console.log('Set position of object ' + this.name + ' to ' + x + ',' + y);
};

//Get object position on the screen
gameObject.prototype.getScreenPosition = function(){
    var pos = currentMap.getTileScreenPos(this.x, this.y);
    pos.x + this.drawOffsetX;
    pos.y + this.drawOffsetY;
    return pos;
};

//Draw image on the screen
gameObject.prototype.drawObject = function(){

    if(this.isAnimated) this.updateAnimation();

    var pos = currentMap.getTileScreenPos(this.x, this.y);
    var posx = pos.x + this.drawOffsetX;
    var posy = pos.y + this.drawOffsetY;

    if(this.img){
        draw.drawObject(this.img, posx, posy, this.animation, this.animationFrame);
    }else{
        draw.drawRect(this.color, posx, posy, currentMap.tileset.tileW, currentMap.tileset.tileH, true);
        draw.drawWorldText('#FFF', this.char, posx + currentMap.tileset.tileW / 2, posy, true, true);
    }
};