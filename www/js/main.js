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

        player = new gameObject('pelaaja', 0, 0, 'black', '@', 'pelaajakuva');
        player.setAnimation(new animation('plranim', 25, 25, 2, 1000));
        currentMap = new map(map1, tiluset);
        player.setPosition(2,2);

        this.attachEvents();

        gameArea.update();
    },
    attachEvents: function(){
        window.addEventListener('keydown', handleKeys);
    },
    clear : function(){
        CTX.fillStyle = "white";
        CTX.fillRect(0, 0, this.width, this.height);
    },
    drawEverything : function(){
        if(currentMap) currentMap.drawMap();
        if(player) player.drawObject();
    },
    update : function(){
        player.updateMovement();
        gameArea.drawEverything();
        requestAnimationFrame(gameArea.update);
    }
}

gameArea.init();
document.addEventListener('deviceready', gameArea.init, false);