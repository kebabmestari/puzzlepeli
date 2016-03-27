"use strict";

//Context is used so often so it is global
var CTX = null;
var player = null;

var gameArea = {
    init : function(){
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", "300");
        this.canvas.setAttribute("height", "200");
        this.width  = this.canvas.width;
        this.height = this.canvas.height;
        CTX = this.canvas.getContext("2d");
        document.getElementById("gamearea").appendChild(this.canvas);

        console.log("Game starting");
        gameArea.clear();
        CTX.font = "20px Helvetica, serif";
        CTX.textAlign = "center";
        CTX.strokeText("Hello", this.canvas.getAttribute("width")/2, this.canvas.getAttribute("height")/2);

        player = new playerObj(2,2);
        player.setAnimation(new animation('plranim', 25, 25, 2, 1000));
        currentMap = new map(map1, tiluset);
        player.setPosition(2,2);

        this.attachEvents();

        var boks = new box(3,3);
        var boks2 = new box(4,4);
        currentMap.objects.push(boks);
        currentMap.objects.push(boks2);

        gameArea.update();
    },
    attachEvents: function(){
        window.addEventListener('keydown', handleKeys);
        swipeDetect(window, handleSwipe);
    },
    clear : function(){
        CTX.fillStyle = "white";
        CTX.fillRect(0, 0, this.width, this.height);
    },
    drawEverything : function(){
        this.clear();
        if(currentMap) {
            currentMap.drawMap();
            var l = currentMap.objects.length;
            for (var i = 0; i < l; i++) {
                currentMap.objects[i].drawObject();
            }
            if (player) player.drawObject();
            if((currentMap.mapW * currentMap.tileset.tileW) > this.canvas.width ||
                (currentMap.mapH * currentMap.tileset.tileH) > this.canvas.height) {
                camera.lockOnPlayer();
                camera.checkMapBoundaries();
            }
        }
        if(!currentMap && editMode){
            mapEditor.drawEditor();
        }
    },
    update : function(){
        player.updateMovement();
        if(currentMap) {
            var l = currentMap.objects.length;
            for (var i = 0; i < l; i++) {
                currentMap.objects[i].updateMovement();
            }
        }

        gameArea.drawEverything();
        requestAnimationFrame(gameArea.update);
    }
}

gameArea.init();
document.addEventListener('deviceready', gameArea.init, false);