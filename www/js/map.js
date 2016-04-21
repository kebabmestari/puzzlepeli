/**
 * Created by Samuel on 3/23/2016.
 */

 "use strict";

var currentMap = null;
var tiluset = null;

//Tile types
var TILETYPE = {
    0   : 'BG',
    1   : 'WALL',
    2   : 'GOAL'
};

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

    this.drawChar = function(obj){
        var pos = this.getTileScreenPos(obj.x, obj.y);
        var posx = pos.x + obj.drawOffsetX;
        var posy = pos.y + obj.drawOffsetY;

        draw.drawRect(obj.color, posx, posy, this.tileset.tileW, this.tileset.tileH, true);
        draw.drawWorldText('#FFF', obj.char, posx + this.tileset.tileW / 2, posy, true, true);
    }

    this.isHit = function(x, y){
        return this.tileData[(y * this.mapW) + x].hit;
    }

    this.getTile = function(x, y){
        return this.tileData[(y * this.mapW) + x];
    }

    this.getTileScreenPos = function(x, y){
        var result = {};

        result.x = this.offsetX + x * this.tileset.tileW;
        result.y = this.offsetY + y * this.tileset.tileH;

        return result;
    }

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
                window.objectsVisible.push(obj);
            }
        }

        this.tileset = map.tileset;

    }

    this.clearMap = function(){
        this.objects = this.tileData = [];
        console.log("Map cleared");
    }

    this.loadMap(map, tileset);

}

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

var defaultTileset = tiluset;

function mapData(name, tileset, tiles, hitmap, plrstart, objects){
    this.name = name || 'unnamed';
    this.tileset = tileset || window.defaultTileset;
    this.tiles = tiles || [];
    this.hitmap = hitmap || [];
    this.plrstart = plrstart || [0,0];
    this.objects = objects || [];
}

//Test map please ignore
var map1 = new mapData(
'testi',
tiluset,
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
