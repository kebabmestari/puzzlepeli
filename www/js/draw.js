/**
 * Created by Samuel on 3/23/2016.
 */

"use strict";

var draw = {
    drawRect : function(color, x, y, w, h, filled){
        CTX.fillStyle   = color;
        CTX.strokeStyle = color;
        filled = filled || 'false';
        if(filled){
            CTX.fillRect(x, y, w, h);
        }else{
            CTX.strokeRect(x, y, w, h);
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
            tileset.tiles[tile].w, tileset.tiles[tile].h, x, y, tileset.tiles[tile].w, tileset.tiles[tile].h);
    },
    drawObject : function(img, x, y, animation, frame){
        var d_x = 0, d_y = 0, d_w = img.imgW, d_h = img.imgH;
        if(animation){
            d_x = (frame + animation.startFrame) * animation.frameW;
            d_y = 0;
            d_w = animation.frameW;
            d_h = animation.frameH;
        }
        CTX.drawImage(img, d_x, d_y, d_w, d_h, x, y, d_w, d_h);
    }
};