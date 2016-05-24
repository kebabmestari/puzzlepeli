"use strict";

//Context is used so often so it is global
var CTX = null;
var player = null;

var gameArea = {
    
    //Create the canvas element
    createCanvas : function(){
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", "640");
        this.canvas.setAttribute("height", "480");
        this.width  = this.canvas.width;
        this.height = this.canvas.height;
        CTX = this.canvas.getContext("2d");
        document.getElementById("gamearea").appendChild(this.canvas);
        
        if(this.canvas)
            console.log('Canvas element created');
    },
    
    //Initialize the game
    init : function(){
        
        this.createCanvas();

        console.log("Game starting");
        gameArea.clear();
        CTX.font = "20px Helvetica, serif";
        CTX.textAlign = "center";
        CTX.strokeText("Loading", this.canvas.getAttribute("width")/2, this.canvas.getAttribute("height")/2);

        player = new playerObj(0,0);
        player.setAnimation(new animation('plranim', 25, 25, 2, 1000));
        currentMap = new map(JSON.parse(
                '{"name":"newmap","tileset":"testi","tiles":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,2,0,0,0,0,0,0,1],[1,0,1,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"hitmap":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,1,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"plrstart":[3,5],"objects":[{"name":"box","x":4,"y":4,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464082202436,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null},{"name":"box","x":4,"y":7,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464082202856,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null},{"name":"box","x":7,"y":3,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464082203196,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null}]}'
                ));

        this.attachEvents();

        gameArea.update();
    },
    
    attachEvents: function(){
        window.addEventListener('keydown', handleKeys);
        swipeDetect(window, handleSwipe);

        this.canvas.ondragstart = function(e) {
            if (e && e.preventDefault) { e.preventDefault(); }
            if (e && e.stopPropagation) { e.stopPropagation(); }
            return false;
        }

        this.canvas.onselectstart = function(e) {
            if (e && e.preventDefault) { e.preventDefault(); }
            if (e && e.stopPropagation) { e.stopPropagation(); }
            return false;
        }
        
        document.addEventListener('contextmenu', function(e){
            e.preventDefault();
        });
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