/**
 * Created by Samuel on 3/23/2016.
 */

 "use strict";

///Current map object
var currentMap = null;

var tiluset = null;

//Array of tilesets
var tilesetList = [];

//Box count
var levelBoxes = 0;

//Tile types
var TILETYPE = {
    0   : 'BG',
    1   : 'WALL',
    2   : 'GOAL',
    3   : 'DOOR'
};

//Get goal tile number
var goalTile = -1;
for(var i = 0; i < Object.keys(TILETYPE).length; i++){
    if(TILETYPE[i] === 'GOAL') goalTile = i;
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
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.requiredBoxes = 0;

    this.playerStart = [0, 0];

    this.mapW = 0;
    this.mapH = 0;

    //Which tile is highlighted
    this.highlight = null;

    this.getMapOffsetX = function() {
        return this.mapOffSetX;
    }
    this.getMapOffsetY = function(){
        return this.mapOffSetY;
    }

    /**
     * Draw the map tiles
     */
    this.drawMap = function(){
        var l = this.tileData.length;
        for(var i = 0; i < l; i++){
            var temp_tile = this.tileData[i];
            var x = this.offsetX + temp_tile.x * this.tileset.tileW;
            var y = this.offsetY + temp_tile.y * this.tileset.tileH;
            draw.drawTile(this.tileset, temp_tile.type, x, y);
            if(temp_tile.highlight) {
                draw.drawRect('yellow', x, y, this.tileset.tileW, this.tileset.tileH, false);
                temp_tile.highlight = false;
            }
        }
    }
    
    this.isGoal = function(x, y){
        return this.getTile(x, y).type === goalTile;
    }
    
    /**
     * Create map data from a map object, reverse map loading
     */
    this.toMapData = function(){
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
                this.objects
        );
        return newMapData;
    }

    /**
     * Draw a character on the map
     * Given a gameobject or character and coordinates
     */
    this.drawChar = function(obj){
        
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
     * Checks whether a tile in the map has it's hit layer set to hit
     * @param {number} x
     * @param {number} y
     * @returns {boolean} True if the tile is hittable
     */
    this.isHit = function(x, y){
        return this.tileData[(y * this.mapW) + x].hit;
    }

    /**
     * Returns a tile object at given coordinates
     * @param {number} x
     * @param {number} y
     * @returns {Array}
     */
    this.getTile = function(x, y){
        return this.tileData[(y * this.mapW) + x];
    }

    /**
     * Returns the given tile position relative to screen in pixels
     * @param {number} x
     * @param {number} y
     * @returns {map.getTileScreenPos.result} Properties x and y
     */
    this.getTileScreenPos = function(x, y){
        var result = {};

        result.x = this.offsetX + x * this.tileset.tileW;
        result.y = this.offsetY + y * this.tileset.tileH;

        return result;
    }

    /**
     * Add an object to the map
     * @param {GameObject} obj
     */
    this.addObject = function(obj){
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
    this.removeObjectFrom = function(x, y){
        for(var i = 0; i < this.objects.length; i++){
            var tempObj = this.objects[i];
            if(tempObj.x === x && tempObj.y === y){
                var tempIndex = this.objects.indexOf(tempObj);
                this.objects.splice(tempIndex, 1);
                return;
            }
        }
    }

    /**
     * Loads a map from mapdata and with given tileset
     * @param {mapdata} map
     * @param {tileset} tileset
     * @returns {undefined}
     */
    this.loadMap = function(map, tileset){

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
            switch (map.objects[i].name) {
                case 'box':
                    this.objects.push(
                            new box(obj.x, obj.y) );
                    break;
                    
                default:
                    console.log('Unidentified object!');
                    break;
            }
            
            var boxcount = 0;
            for(var o in this.objects)
                if(this.objects[o].name && this.objects[o].name === 'box') boxcount++;
            this.requiredBoxes = map.requiredBoxes || (boxcount === 0 ? 1 : boxcount);
        
        }
    }

    /**
     * Clear a map
     */
    this.clearMap = function(){
        this.objects = this.tileData = [];
        console.log("Map cleared");
    }

    this.loadMap(map, map.tileset);

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

var kebab = document.getElementById('testitileset');
tiluset = new tilesetObj("testi", kebab, 25, 25);

var defaultTileset = 'testi';

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
