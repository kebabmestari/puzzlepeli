/**
 * Created by Samuel on 3/23/2016.
 */

'use strict';

//Container for all animations
var animations = [];

var OBJMOVESPEED = 5;

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

    //Placeholder character
    this.char = (typeof char === 'string' && char.length === 1) ?char:'?';

    this.img = document.getElementById(img) || null;
    if(this.img){
        this.imgW = img.width;
        this.imgH = img.height;
    }

    console.log("Game object " + name + " created");
}

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
}

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

        if(Math.abs((this.targetX*tileW - (this.x*tileW+this.drawOffsetX))) <= window.OBJMOVESPEED &&
           Math.abs((this.targetY*tileH - (this.y*tileH+this.drawOffsetY))) <= window.OBJMOVESPEED){
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
            this.drawOffsetX = 0;
            this.drawOffsetY = 0;
        }
    }
}

gameObject.prototype.move = function(dir){
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
    if(currentMap.isHit(this.targetX, this.targetY)){
        this.isMoving = false;
        this.targetX = this.x;
        this.targetY = this.y;
    }
    if(this.isMoving) this.moveDir = dir;
}

//Check time and update animation if needed
gameObject.prototype.updateAnimation = function(){
    if((Date.now() - +this.animationTick) >= this.animation.speed){
        this.updateFrame();
        this.animationTick = Date.now();
    }
}

//Go to next frame
gameObject.prototype.updateFrame = function(){
    this.animationFrame++;
    if(this.animationFrame >= this.animation.frames){
        this.animationFrame = 0;
    }
}

//Stop animation
gameObject.prototype.stopAnimation = function(){
    this.isAnimated = false;
}

//Set object position
gameObject.prototype.setPosition = function(x, y){
    if(x >= 0 && x < currentMap.mapW && y >= 0 && y < currentMap.mapH){
        this.x = x; this.y = y;
    }
}

gameObject.prototype.getScreenPosition = function(){
    var pos = currentMap.getTileScreenPos(this.x, this.y);
    var posx = pos.x + this.drawOffsetX;
    var posy = pos.y + this.drawOffsetY
    return {posx, posy};
}

//Draw image on the screen
gameObject.prototype.drawObject = function(){

    if(this.isAnimated) this.updateAnimation();

    var pos = currentMap.getTileScreenPos(this.x, this.y);
    var posx = pos.x + this.drawOffsetX;
    var posy = pos.y + this.drawOffsetY

    if(this.img){
        draw.drawObject(this.img, posx, posy, this.animation, this.animationFrame);
    }else{
        draw.drawRect(this.color, posx, posy, currentMap.tileset.tileW, currentMap.tileset.tileH, true);
        draw.drawWorldText('#FFF', this.char, posx + currentMap.tileset.tileW / 2, posy, true, true);
    }
}

function playerObj(x, y){
    gameObject.call(this, 'player', x, y, 'green', '@', 'pelaajakuva');

    this.move = function(x, y){
        gameObject.prototype.move.call(this, x, y);
        var l = currentMap.objects.length;
        for(var i = 0; i < l; i++){
            var tempObj = currentMap.objects[i];
            if(tempObj.x === this.targetX && tempObj.y === this.targetY){
                var boxTargetX = tempObj.x, boxTargetY = tempObj.y;
                switch(this.moveDir){
                    case 'up':
                        boxTargetY -= 1;
                        break;
                    case 'right':
                        boxTargetX += 1;
                        break;
                    case 'down':
                        boxTargetY += 1;
                        break;
                    case 'left':
                        boxTargetX -= 1;
                        break;
                }
                if(tempObj.canMoveTo(boxTargetX, boxTargetY)){
                    tempObj.move(this.moveDir);
                }else{
                    this.isMoving = false;
                    this.targetX = this.x;
                    this.targetY = this.y;
                }
            }
        }
    }

    console.log('Player created');
}
playerObj.prototype = Object.create(gameObject.prototype);

function box(x, y){
    gameObject.call(this, 'box', x, y, 'red', '#', null);

    console.log('Box created');
}
box.prototype = Object.create(gameObject.prototype);

box.prototype.canMoveTo = function(x, y){
    var l = currentMap.objects.length;
    for(var i = 0; i < l; i++){
        var tempObj = currentMap.objects[i];
        if((tempObj != this) && (tempObj.x === x && tempObj.y === y)){
            return false;
        }
        if(currentMap.getTile(x, y).hit){
            return false;
        }
    }
    return true;
}

//Animation object
function animation(name, frameW, frameH, frames, speed, startFrame){

    this.name = name;
    this.frameW = frameW;
    this.frameH = frameH;
    this.frames = frames;
    this.startFrame = startFrame || 0;
    this.speed = speed; //Length of one frame

    window.animations.push(this);

    console.log('Animation ' + this.name + ' created');
}
