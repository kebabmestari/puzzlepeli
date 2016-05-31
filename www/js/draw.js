/**
 * Methods related to drawing to the canvas
 */

'use strict';

var CAMERASPEED = 25;

var draw = {
    //Draw a rectangle
    drawRect : function(color, x, y, w, h, filled){
        CTX.fillStyle   = color;
        CTX.strokeStyle = color;
        if(filled){
            CTX.fillRect(x - camera.x, y - camera.y, w, h);
        }else{
            CTX.strokeRect(x - camera.x, y - camera.y, w, h);
        }
    },
    //Draw text that is centered to the canvas
    drawCenteredText : function(text){
        this.drawText(text, gameArea.width/2, gameArea.height/2, true);
    },
    //Draw text
    drawText : function(color, text, x, y, fill, center){
        CTX.fillStyle   = color;
        CTX.strokeStyle = color;
        CTX.textBaseline = 'top';
        CTX.textAlign = center ? 'center' : 'left';
        if(fill){
            CTX.fillText(text, x, y);
        }else{
            CTX.strokeText(text, x, y);
        }
    },
    //Draw text according to the world coordinates
    drawWorldText : function (color, text, x, y, fill, center) {
        this.drawText(color, text, x - camera.x, y - camera.y, fill, center);
    },
    //Draw a tile from the tileset
    drawTile : function(tileset, tile, x, y){
        CTX.drawImage(tileset.getImage(), tileset.tiles[tile].x, tileset.tiles[tile].y,
            tileset.tiles[tile].w, tileset.tiles[tile].h,
            x - camera.x, y - camera.y, tileset.tiles[tile].w, tileset.tiles[tile].h);
    },
    //Draw an object
    drawObject : function(img, x, y, animation, frame){
        var d_x = 0, d_y = 0, d_w = img.width, d_h = img.height;
        if(animation){
            d_x = (frame + animation.startFrame) * animation.frameW;
            d_y = 0;
            d_w = animation.frameW;
            d_h = animation.frameH;
        }
        CTX.drawImage(img, d_x, d_y, d_w, d_h, x - camera.x, y - camera.y, d_w, d_h);
    }
};

//The game view camera
var camera = {
    x: 0,
    y: 0,
    //Check that the camera bounding box doesn't exit the map
    checkMapBoundaries: function() {
        if (this.x < currentMap.offsetX) this.x = currentMap.offsetX;
        if (this.y < currentMap.offsetY) this.y = currentMap.offsetY;
        if ((this.x + gameArea.canvas.width) > currentMap.getMapOffsetX() + currentMap.getMapW())
            this.x = (currentMap.offsetX + currentMap.getMapOffsetX() + currentMap.getMapW()) - gameArea.canvas.width;
        if ((this.y + gameArea.canvas.height) > currentMap.getMapOffsetY() + currentMap.getMapH())
            this.y = (currentMap.getMapOffsetY() + currentMap.getMapH()) - gameArea.canvas.height;
    },
    //Center the camera on the player
    lockOnPlayer: function(){
        var tileW = currentMap.tileset.tileW;
        var tileH = currentMap.tileset.tileH;
        this.x = (currentMap.offsetX + player.x * tileW + player.drawOffsetX + currentMap.tileset.tileW / 2) - gameArea.canvas.width/2;
        this.y = (currentMap.offsetY + player.y * tileH + player.drawOffsetY + currentMap.tileset.tileH / 2) - gameArea.canvas.height/2;
    }
};
