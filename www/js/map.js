/**
 * Created by Samuel on 3/23/2016.
 */

 "use strict";

var currentMap = null;
var tiluset = null;

//Tile types
var TILETYPE = {
    0   : 'BG',
    1   : 'WALL'
};

/**
*   Map constructor
*
*/
function map(map, tileset){

    this.name = map.name;
    this.tileset = null;
    //Map tiledata
    this.tileData = [];
    //Objects on map
    this.objects = [];
    this.offsetX = 0;
    this.offsetY = 0;

    this.mapW = 0;
    this.mapH = 0;

    this.getMapOffsetX = function() {
        return this.mapOffSetX;
    }
    this.getMapOffsetY = function(){
        return this.mapOffSetY;
    }

    this.drawMap = function(){
        var l = this.tileData.length;
        for(var i = 0; i < l; i++){
            var temp_tile = this.tileData[i];
            draw.drawTile(this.tileset, temp_tile.type,
                this.offsetX + temp_tile.x * this.tileset.tileW,
                this.offsetY + temp_tile.y * this.tileset.tileH);
        }
    }

    this.isHit = function(x, y){
        return this.tileData[(y * this.mapW) + x].hit;
    }

    this.getTileScreenPos = function(x, y){
        var result = {};

        result.x = this.offsetX + x * this.tileset.tileW;
        result.y = this.offsetY + y * this.tileset.tileH;

        return result;
    }

    this.loadObject = function(obj){
        objects.push(JSON.parse(obj));
        console.log("Object loaded");
    }

    this.loadMap = function(map, tileset){

        this.tileset = tileset;

        if(!map) throw "Invalid map object given"

        var y = 0, x = 0;

        this.mapW = map.tiles[0].length;
        this.mapH = map.tiles.length;
        
        //Load tile and hit data
        for(y = 0; y < this.mapH; y++){
            for(x = 0; x < this.mapW; x++){
                var newtile = new tile(x, y, map.tiles[y][x], (map.hitmap[y][x]===1)?true:false );
                this.tileData.push(newtile);
            }
        }

        for(var i = 0; i < map.objects.length; i++){
            var obj = map.objects[i];
            if(obj instanceof gameobject){
                this.objects.push(obj);
            }
        }

        this.tileset = map.tileset;

    }

    this.clearMap = function(){
        objects = tileData = [];
        console.log("Map cleared");
    }

    this.loadMap(map, tileset);

}

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
}

//Tileset constructor
//Object encloses data and methods about tileset
function tileset(img, tileW, tileH){
    
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

}

//Represents a tile in tileset, eg it's dimensions
function tileRect(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

var kebab = document.getElementById('testitileset');
tiluset = new tileset(kebab, 25, 25);

//Test map please ignore
var map1 = {
name: 'testi',
tileset: tiluset,
size: [8, 8],
tiles: [
[0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0]
],
hitmap: [
[0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,0,0,0,0,1,0],
[0,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0]
],
plrstart: [2,2],
boxes: [[4,4]],
objects : []
};