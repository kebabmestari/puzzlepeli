/**
 * Created by Samuel on 3/23/2016.
 */

 "use strict";

///Current map object
var currentMap = null;
var tiluset = null;
var defaultTileset = 'testi';
//Array of tilesets
var tilesetList = [];
//Box count
var levelBoxes = 0;

//Tile types
var TILETYPE = {
    0   : 'BG',
    1   : 'WALL',
    2   : 'GOAL',
    3   : 'DOOR',
    4   : 'WATER',
    5   : 'WATER2',
    6   : 'SUNKENBOX'
};

var TILETYPE2 = {}

//Create a tile lookup table so you don't have to spend time at it every time
var _createTileL = (function createTileLookupTable(){
    for(var i = 0, t= Object.keys(TILETYPE); i < t.length; i++){
        TILETYPE2[TILETYPE[i]] = i;
    }
})();

/**
 * Returns the corresponding tile order number
 * @param {string} name name of the tile
 * @returns {number} number of the tile (on the tileset)
 */
function getTileNumber(name){
    if(TILETYPE2[name])
        return TILETYPE2[name];
    else
        return null;
}

//Get goal tile number
var goalTile = getTileType('GOAL');

//Default map animation speed
var tilesetAnimationDefaultSpeed = 500;

/**
 * Search for tile type index
 * @param {string} name Name of the tile
 * @returns {Number} the index
 */
function getTileType(name){
    for(var i = 0; i < Object.keys(TILETYPE).length; i++){
        if(TILETYPE[i] === name) return i;
    }
    return -1;
}

/**
*   Map constructor
*
*/
function map(map){

    this.name = map.name;
    this.tileset = null;
    //Map tiledata
    this.tileData = [];
    
    //Objects on map
    this.objects = [];
    
    //Objects which will be removed at the end of the update
    this.removeObjects = [];
    
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.requiredBoxes = 0;

    this.playerStart = [0, 0];

    this.mapW = 0;
    this.mapH = 0;
    
    //Reset map animation
    this.animationTick = Date.now();
    
    //Array of arrays which record the each individual tile animation on this map
    //[0] tick [1] frame
    this.runningAnimation = [];
    for(var i = 0, l = Object.keys(TILETYPE).length; i < l; i++){
        this.runningAnimation[i] = [Date.now(), 0];
    }

    //Which tile is highlighted
    this.highlight = null;

    this.loadMap(map, map.tileset);

}

/**
 * Updates map animations
 */
map.prototype.updateAnimation = function(){
    for(var i = 0, l = this.tileset.animations.length; i < l; i++){
        var a = this.runningAnimation[this.tileset.animations[i].startFrame];
        if((Date.now() - a[0]) >= this.tileset.animations[i].speed){
            //Reset tick
            a[0] = Date.now();
            //Increase frame
            a[1]++;
            //Restart animation if it goes over
            if(a[1] > this.tileset.animations[i].frames - 1){
                a[1] = 0;
            }
        }
    }
};

/**
 * Checks if the map should be centered and centers it if so
 */
map.prototype.checkForCenter = function(){
    if(!this.isLargerThanScreenW()){
        this.offsetX =
                ~~ (gameArea.width -
                this.getMapW()) / 2;
    }
    if(!this.isLargerThanScreenH()){
        this.offsetY =
                ~~ (gameArea.height -
                this.getMapH()) / 2;
    }
};

//Return true if the map is larger than the canvas
map.prototype.isLargerThanScreenW = function(){
    if(this.getMapW() > gameArea.width)
        return true;
    return false;
};
map.prototype.isLargerThanScreenH = function(){
    if(this.getMapH() > gameArea.height)
        return true;
    return false;
};

//Get map width as pixels
map.prototype.getMapW = function(){
    return this.getMapSize().w || 0;
};
//Get map width as pixels
map.prototype.getMapH = function(){
    return this.getMapSize().h || 0;
};

map.prototype.getMapSize = function(){
    return {
      w : this.mapW * this.tileset.tileW,
      h : this.mapH * this.tileset.tileH
    };
};

//Return map offsets
map.prototype.getMapOffsetX = function() {
    return this.mapOffSetX;
}
map.prototype.getMapOffsetY = function(){
    return this.mapOffSetY;
}

/**
 * Draw the map tiles
 */
map.prototype.drawMap = function(){
    this.updateAnimation();
    var l = this.tileData.length;
    for(var i = 0; i < l; i++){
        var temp_tile = this.tileData[i];
        var x = this.offsetX + temp_tile.x * this.tileset.tileW;
        var y = this.offsetY + temp_tile.y * this.tileset.tileH;
        //Draw tile, take animation in count (if no animation, runningAnimation frame value is 0)
        draw.drawTile(this.tileset, temp_tile.type + this.runningAnimation[temp_tile.type][1],
                x, y);
        //Highlight the tile with yellow borders in leveleditor
        if(temp_tile.highlight) {
            draw.drawRect('yellow', x, y, this.tileset.tileW, this.tileset.tileH, false);
            temp_tile.highlight = false;
        }
    }
}

//Returns true if given tile is a goal tile
map.prototype.isGoal = function(x, y){
    return this.getTile(x, y).type === goalTile;
}

/**
 * Create map data from a map object, reverse map loading
 */
map.prototype.toMapData = function(){
    var newTileData = [];
    var newHitData = [];

    for(var y = 0; y < this.mapH; y++){
        var newRow  = [];
        var newRow2 = [];
        for(var x = 0; x < this.mapW; x++){
            newRow.push(this.tileData[y * this.mapW + x].type);
            newRow2.push((this.tileData[y * this.mapW + x].hit) ? 1 : 0);
        }
        newTileData.push(newRow);
        newHitData.push(newRow2);
    }

    var newMapData = new mapData(
            this.name,
            this.tileset.name,
            newTileData,
            newHitData,
            this.playerStart,
            this.objects,
            this.requiredBoxes
    );
    return newMapData;
}

/**
 * Draw a character on the map
 * Given a gameobject or character and coordinates
 */
map.prototype.drawChar = function(obj){

    var posx = 0, posy = 0, color = '#000', pos = {};

    if(typeof obj === 'object'){
        pos = this.getTileScreenPos(obj.x, obj.y);
        posx = pos.x + obj.drawOffsetX;
        posy = pos.y + obj.drawOffsetY;
        color = obj.color;
    } else if(typeof obj === 'string'){
        pos = this.getTileScreenPos(arguments[1], arguments[2]);
        posx = pos.x;
        posy = pos.y;
        if(arguments[3])
            color = arguments[3];
    } else{
        console.log('Invalid arguments to drawChar');
        return;
    }

    draw.drawRect(color, posx, posy, this.tileset.tileW, this.tileset.tileH, true);
    draw.drawWorldText('#FFF', (obj.char ? obj.char : obj),
            posx + this.tileset.tileW / 2, posy, true, true);
}

/**
 * Returns a tile object at given coordinates
 * @param {number} x
 * @param {number} y
 * @returns {Array}
 */
map.prototype.getTile = function(x, y){
    return this.tileData[(y * this.mapW) + x];
}

/**
 * Edit tile properties
 * @param {number} x
 * @param {number} y
 * @param {TILETYPE} type
 * @param {boolean} hit
 */
map.prototype.setTile = function(x, y, type, hit){
    var tile = this.getTile(x, y);
    tile.hit = (hit == undefined ? tile.hit : hit);
    tile.type = type;
}

//Set hit value of tile
map.prototype.setHit = function(x, y, hit){
    setTile(x, y, this.getTile(x, y).type, hit);
}

/**
 * Returns the given tile position relative to screen in pixels
 * @param {number} x
 * @param {number} y
 * @returns {map.getTileScreenPos.result} Properties x and y
 */
map.prototype.getTileScreenPos = function(x, y){
    var result = {};

    result.x = this.offsetX + x * this.tileset.tileW;
    result.y = this.offsetY + y * this.tileset.tileH;

    return result;
}

/**
 * Add an object to the map
 * @param {GameObject} obj
 */
map.prototype.addObject = function(obj){
    var object = null;
    if(typeof obj === 'string')
        object = JSON.parse(obj);
    else
        object = obj;

    for(var i = 0; i < this.objects.length; i++){
        var tempObj = this.objects[i];
        if(tempObj.x === object.x && tempObj.y === object.y){
            console.log('Cannot add object over another object');
            return;
        }
    }

    this.objects.push(object);
    console.log("Object added");
}

/**
 * Removes an object from the given coordinates
 * @param {number} x
 * @param {number} y
 */
map.prototype.removeObjectFrom = function(x, y){
    for(var i = 0; i < this.objects.length; i++){
        var tempObj = this.objects[i];
        if(tempObj.x === x && tempObj.y === y){
            this.removeObject(tempObj);
            return;
        }
    }
}

/**
 * Add object to the kill list
 * @param {type} obj
 */
map.prototype.removeObject = function(obj){
    if(!(obj instanceof gameObject))
        throw 'Invalid object given to clearRemoveList';
    this.removeObjects.push(obj);
    console.log('Object ' + obj.name + ' set to be removed');
};

/**
 * 
 * @param {gameObject} obj
 */
map.prototype.clearRemoveList = function(){
    for(var i = 0, l = this.removeObjects.length; i < l; i++){
        var obj = this.removeObjects[i];
        var tempIndex = this.objects.indexOf(obj);
        console.log('Object ' + obj.name + ' removed');
        this.objects.splice(tempIndex, 1);
    }
    this.removeObjects = [];
    return;
};

/**
 * Loads a map from mapdata and with given tileset
 * @param {mapdata} map
 * @param {tileset} tileset
 * @returns {undefined}
 */
map.prototype.loadMap = function(map, tileset){

    if(typeof tileset !== 'string'){
        console.log('Invalid tileset name to loadMap!');
        return;
    }
    this.tileset = getTileset(tileset);

    if(!map) throw "Invalid map object given"

    var y = 0, x = 0;

    this.mapW = map.tiles[0].length;
    this.mapH = map.tiles.length;


    //Set player position
    window.player.setPosition(map.plrstart[0], map.plrstart[1]);

    //Load tile and hit data
    for(y = 0; y < this.mapH; y++){
        for(x = 0; x < this.mapW; x++){
            var newtile = new tile(x, y, map.tiles[y][x], (map.hitmap[y][x]===1)?true:false );
            this.tileData.push(newtile);
        }
    }

    //Reading and creating level objects
    for(var i = 0; i < map.objects.length; i++){
        var obj = map.objects[i];
//        var newobj = {};
//        for(var o in obj)
//            newobj[o] = obj[o];
//        this.objects.push(newobj);
        
        switch (obj.name) {
            case 'box':
                this.objects.push(
                        new box(obj.x, obj.y) );
                break;
            case 'key':
                this.objects.push(
                        new key(obj.x, obj.y));
                break;
            default:
                console.log('Unidentified object!');
                break;
        }
    }

        var boxcount = 0;
        for(var o in this.objects)
            if(this.objects[o].name && this.objects[o].name === 'box') boxcount++;
        this.requiredBoxes = map.requiredBoxes || (boxcount === 0 ? 1 : boxcount);

        this.checkForCenter();
}

/**
 * Clear a map
 */
map.prototype.clearMap = function(){
    this.objects = this.tileData = [];
    console.log("Map cleared");
}

/**
 * Checks whether a tile in the map has it's hit layer set to hit
 * @param {number} x
 * @param {number} y
 * @returns {boolean} True if the tile is hittable
 */
map.prototype.isHit = function(x, y){
    return this.tileData[(y * this.mapW) + x].hit;
}

/**
 * Gets a tile object from given coordinates
 * @param {number} x
 * @param {number} y
 * @returns {tile} Tile from the coordinates
 */
map.prototype.getTileScreen = function(x, y){
    var startX = (x - this.offsetX + camera.x);
    var startY = (y - this.offsetY + camera.y);
    if(startX < 0 || startX > this.mapW * this.tileset.tileW || startY < 0 || startY > this.mapH * this.tileset.tileH){
        return null;
    }
    return this.tileData[this.mapW * (~~(startY / this.tileset.tileH)) +
        (~~(startX / this.tileset.tileW))];
};

//Object which represents a tile in map data
function tile(x, y, type, hit, tile){

    if(x < 0 || y < 0 ||
            type < 0 || type > Object.keys(TILETYPE).length ||
            !(typeof hit === 'boolean'))
                throw "Invalid values given to TILE constructor";

    this.x = x;
    this.y = y;
    this.type = type;
    this.hit = hit;
    this.highlight = false;
}

//Tileset constructor
//Object encloses data and methods about tileset
function tilesetObj(name, img, tileW, tileH){

    this.name = name;
    this.image = img;

    this.tilesX = ~~(img.width/tileW);
    this.tilesY = ~~(img.height/tileH);

    this.tileW = tileW;
    this.tileH = tileH;
    
    //Tileset animations
    this.animations = [];

    this.tiles = [];

    this.getImage = function(){
        return this.image;
    };

    this.createTileset = function(){
        var x = 0, y = 0;
        var i = 0;
        while(true){
            if(x >= this.tilesX){
                x = 0;
                y++;
            }
            if(y >= this.tilesY){
                break;
            }

            this.tiles[i] = new tileRect(x * this.tileW, y * this.tileH, this.tileW, this.tileH);

            x++; i++;
        }
    };

    if(this.image) this.createTileset();
    
    //Add new tileset to list
    window.tilesetList.push(this);

}

/**
 * Add animations to tileset
 * @param {array} anim Array of animation-objects
 */
tilesetObj.prototype.setAnimations = function(anim){
    Array.prototype.push.apply(anim);
    console.log('Set ' + anim.length + ' animations for tileset ' + this.name);
};

/**
 * Create a new map animation for tileset
 * @param {string} name Name of the animation
 * @param {number} start Starting frame
 * @param {number} length Length in frames
 * @param {number} speed Milliseconds per frame
 */
tilesetObj.prototype.addAnimation = function(name, start, length, speed){
    if((start * this.tileW + length * this.tileW) > this.image.width ){
        console.log('Animation over the boundaries when creating animation ' + name);
        return;
    }
    var anim = new animation(name, this.tileW, this.tileH, length,
            (speed ? speed : tilesetAnimationDefaultSpeed), start);
    this.animations.push(anim);
    console.log('Created animation ' + name + ' for tileset ' + this.name);
};

/**
 * Get a tileset object by name
 * @param {string} name Name of the tileset
 * @returns {tileset} Found tileset or null
 */
function getTileset(name){
    for(var i = 0; i < window.tilesetList.length; i++){
        var temp = window.tilesetList[i];
        if(temp.name === name){
            return temp; 
        }
    }
    console.log('Tileset ' + name + ' not found!');
    return null;
}

//Represents a tile in tileset, eg it's dimensions
function tileRect(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function mapData(name, tileset, tiles, hitmap, plrstart, objects, requiredboxes){
    this.name = name || 'unnamed';
    this.tileset = tileset || window.defaultTileset;
    this.tiles = tiles || [];
    this.hitmap = hitmap || [];
    this.plrstart = plrstart || [0,0];
    this.objects = objects || [];
    var boxcount = 0;
    for(var o in objects)
        if(o.name && o.name === 'box') boxcount++;
    this.requiredBoxes = requiredboxes || boxcount;
    console.log('Map ' + name + ' with tileset ' + tileset + ' created');
}

//Test map please ignore
var map1 = new mapData(
'testi',
'testi',
[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,0,0,0,0,0,0,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
],
    [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
],
[2,2],
[]
);
