/**
 * Created by Samuel on 3/23/2016.
 */

"use strict";

var CAMERASPEED = 25;

var draw = {
    drawRect : function(color, x, y, w, h, filled){
        CTX.fillStyle   = color;
        CTX.strokeStyle = color;
        if(filled){
            CTX.fillRect(x - camera.x, y - camera.y, w, h);
        }else{
            CTX.strokeRect(x - camera.x, y - camera.y, w, h);
        }
    },
    drawCenteredText : function(text){
        this.drawText(text, gameArea.width/2, gameArea.height/2, true);
    },
    drawText : function(color, text, x, y, fill, center){
        CTX.fillStyle   = color;
        CTX.strokeStyle = color;
        CTX.textBaseline = 'top';
        CTX.textAlign = center?'center':'left';
        if(fill){
            CTX.fillText(text, x, y);
        }else{
            CTX.strokeText(text, x, y);
        }
    },
    drawTile : function(tileset, tile, x, y){
        CTX.drawImage(tileset.getImage(), tileset.tiles[tile].x, tileset.tiles[tile].y,
            tileset.tiles[tile].w, tileset.tiles[tile].h,
            x - camera.x, y - camera.y, tileset.tiles[tile].w, tileset.tiles[tile].h);
    },
    drawObject : function(img, x, y, animation, frame){
        var d_x = 0, d_y = 0, d_w = img.imgW, d_h = img.imgH;
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
    checkMapBoundaries: function() {
        if (this.x < currentMap.offsetX) this.x = currentMap.offsetX;
        if (this.y < currentMap.offsetY) this.y = currentMap.offsetY;
        if ((this.x + gameArea.canvas.width) > (currentMap.offsetX + currentMap.mapW * currentMap.tileset.tileW))
            this.x = (currentMap.offsetX + currentMap.mapW * currentMap.tileset.tileW) - gameArea.canvas.width;
        if ((this.y + gameArea.canvas.height) > (currentMap.offsetY + currentMap.mapH * currentMap.tileset.tileH))
            this.y = (currentMap.offsetY + currentMap.mapH * currentMap.tileset.tileH) - gameArea.canvas.height;
    },
    lockOnPlayer: function(){
        this.x = -(currentMap.offsetX + player.x + player.drawOffsetX * currentMap.tileset.tileW + currentMap.tileset.tileW / 2)/2;
        this.y = -(currentMap.offsetY + player.y + player.drawOffsetY * currentMap.tileset.tileH + currentMap.tileset.tileH / 2)/2;
    }
};