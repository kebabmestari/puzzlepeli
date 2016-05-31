"use strict";

//Context is used so often so it is global
var CTX = null;
var player = null;

//Game variable
var gameOn = true;

//Inventory array
var inventory = [];

//Main object
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

        var kebab = document.getElementById('testitileset');
        tiluset = new tilesetObj("testi", kebab, 25, 25);
        tiluset.addAnimation('water', 4, 2, 500);

        player = new playerObj(0,0);
        player.setAnimation(new animation('plranim', 25, 25, 2, 1000));
        
//        var startmap = {};
//        loadMapFile('http://kebabkeisari.com/foo/puzzle/testi.map', startmap, false);

        this.attachEvents();
        
        var wmes = window.setInterval(function(){console.log('waiting..');}, 1000);

        window.clearInterval(wmes);

        currentMap = new map(getMap(0));
        this.countBoxes();

        gameArea.update();
    },
    
    attachEvents: function(){
        
        //Game controllers
        window.addEventListener('keydown', handleKeys);
        swipeDetect(window, handleSwipe);

        //Prevent dragging on the page
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
        
        //Prevent context menu on right click but handle the event
        document.addEventListener('contextmenu', function(e){
            e.preventDefault();
            var event = document.createEvent('mousedown')
            event.button = 2;
            gameArea.dispatchEvent(event);
        });
    },
    //Clear the screen
    clear : function(){
        CTX.fillStyle = "white";
        CTX.fillRect(0, 0, this.width, this.height);
    },
    //Draw the game
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
    //Update the game logic and everything else
    update : function(){
        
        if(gameOn){
            player.updateMovement();
            handleCollisions();
        }
        
        if(currentMap) {
            
            var l = currentMap.objects.length;
            
            var boxesAtGoals = 0;
            
            for (var i = 0; i < l; i++) {
                var tempobj = currentMap.objects[i];
                tempobj.updateMovement();
                
                //Count how many boxes are over goals
                if(tempobj.name === 'box'){
                    if(tempobj.checkGoal()){
                        boxesAtGoals++;
                    }
                }
                
                //Check if they are enough for win
                if(boxesAtGoals >= currentMap.requiredBoxes){
                    gameOn = false;
                    draw.drawCenteredText('WIN');
                }
            }
        }
        
        currentMap.clearRemoveList();

        gameArea.drawEverything();
        requestAnimationFrame(gameArea.update);
    },
    countBoxes : function(){
        levelBoxes = 0;
        var l = currentMap.objects.length;
        for (var i = 0; i < l; i++) {
            if(currentMap.objects[i].name === 'box'){
                levelBoxes++;
            }
        }
    }
};

gameArea.init();
document.addEventListener('deviceready', gameArea.init, false);