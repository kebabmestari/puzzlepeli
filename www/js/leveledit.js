/**
 * Created by Samuel on 3/26/2016.
 */

var mapEditor = null;
var newMap = null;

var editMode = false;

var infoDiv = document.getElementById('info');
var infoText = infoDiv.firstChild;

var editorEntities = {
    0 : 'bg',
    1 : 'wall',
    2 : 'box',
    3 : 'playerstart',
    4 : 'goal'
};

/**
 * Initializes the level editor
 */
function initEditor(){
    mapEditor = {
        mapW: 0,
        mapH: 0,
        selected: 0,
        pickedTile: null,
        mousedown: false,
        mapName: 'empty',
        newMapData: null,
        init: function(){
            window.infoDiv.style.display = 'block';
            this.mapW = window.prompt('Map WIDTH in tiles', 10);
            this.mapH = window.prompt('Map HEIGHT in tiles', 10);
            this.mapName = window.prompt('Map NAME', 'newmap');

            if(!(this.mapW > 0 && this.mapH > 0)){
                mapEditor = null;
                return;
            }
            var emptyTilemap = null, emptyHitmap = null;
            //Create empty tilemap
            var emptyMap = [], emptyLine = [];
            for (var y = 0; y < this.mapH; y++) {
                emptyLine = [];
                for (var x = 0; x < this.mapW; x++) {
                    emptyLine.push(0);
                }
                emptyMap.push(emptyLine);
            }

            //Notice deep copy!!
            this.newMapData = new mapData(this.mapName, defaultTileset, JSON.parse(JSON.stringify(emptyMap)),
                JSON.parse(JSON.stringify(emptyMap)), [0, 0], []);
            newMap = new map(this.newMapData);
            console.log('Editor initialized');

            editMode = true;

            //Add event handler
            gameArea.canvas.addEventListener('mousemove', function(e){
                mapEditor.hoverTile.call(mapEditor, e || window.event)
                if(mapEditor.mousedown){
                    mapEditor.selectTile.call(mapEditor, e || window.event);
                }
            });
            gameArea.canvas.addEventListener('mousedown', function(e){
                mapEditor.mousedown = true;
            });
            window.addEventListener('mouseup', function(e){
                mapEditor.mousedown = false;
            });

            this.updateInfo();
        },
        //Draw map and the objects
        drawEditor: function(){
            newMap.drawMap();
            var l = newMap.objects.length;
            var tempObj = null;
            for (var i = 0; i < l; i++) {
                tempObj = newMap.objects[i];
                newMap.drawChar(tempObj);
            }
            newMap.drawChar('P', newMap.playerStart[0], newMap.playerStart[1]); //Player start
        },
        //Add one more row to the map
        addRow: function(){
            var newLine = [];
            for(var i = 0; i < this.newMapData.tiles[0].length; i++){
                newLine.push(0);
            }
            this.newMapData = newMap.toMapData();
            this.newMapData.tiles.push(newLine.splice(0));
            this.newMapData.hitmap.push(newLine.splice(0));
            this.mapH++;
            this.updateMap();
        },
        //Delete one row
        deleteRow: function(){
            this.newMapData = newMap.toMapData();
            this.newMapData.tiles.pop();
            this.newMapData.hitmap.pop();
            this.mapH--;
            this.updateMap();
        },
        ///Add column
        addCol: function(){
            this.newMapData = newMap.toMapData();
            for(var i = 0; i < this.newMapData.tiles.length; i++){
                this.newMapData.tiles[i].push(0);
                this.newMapData.hitmap[i].push(0);
            }
            this.mapW++;
            this.updateMap();
        },
        //Delete column
        deleteCol: function(){
            this.newMapData = newMap.toMapData();
            for(var i = 0; i < this.newMapData.tiles.length; i++){
                this.newMapData.tiles[i].pop();
                this.newMapData.hitmap[i].pop();
            }
            this.mapW--;
            this.updateMap();
        },
        //Create a new map object with the updated data
        updateMap: function(){
            newMap = new map(this.newMapData);
            this.updateInfo();
        },
        //Update the info element
        updateInfo: function(){
            infoText.innerHTML = 'Selected element: ' + editorEntities[this.selected] + '\n Map width: ' +
                this.mapW + '\n Map height: ' + this.mapH;
        },
        //Handle mouse hovering over a tile
        hoverTile: function(e){
            var mousepos = getMousePosScreen(gameArea.canvas, e);
            var pickedTile = null;
            if(pickedTile = newMap.getTileScreen(mousepos.x, mousepos.y)){
                pickedTile.highlight = true;
            }
            this.pickedTile = pickedTile;
        },
        //Output map data into popup
        showJSON : function(){
          this.newMapData = newMap.toMapData();
          var el = document.getElementById('jsontarget');
          el.innerHTML = this.createJSON();
          el.parentNode.style.display = 'block';
        },
        //Turn map object into json string
        createJSON : function(){
            return JSON.stringify(this.newMapData);
        },
        //Handle tile selection
        selectTile: function(e){
            e.preventDefault();
            if(!this.pickedTile)
                return;
            var mouseButton = e.button;
            var selection = editorEntities[this.selected];
            if(mouseButton === 2){
                newMap.removeObjectFrom(this.pickedTile.x, this.pickedTile.y);
                return false;
            }
            //Edit selected tile depending on what is selected
            if(this.pickedTile){
                switch(selection){
                    case 'bg':
                        this.pickedTile.type = 0;
                        this.pickedTile.hit = false;
                        break;
                    case 'wall':
                        this.pickedTile.type = 1;
                        this.pickedTile.hit = true;
                        break;
                    case 'box':
                        newMap.addObject(new box(this.pickedTile.x, this.pickedTile.y));
                        console.log('New box added');
                        break;
                    case 'playerstart':
                        newMap.playerStart = [this.pickedTile.x, this.pickedTile.y];
                        break;
                    case 'goal':
                        this.pickedTile.type = 2;
                        this.pickedTile.hit = false;
                        break;
                }
            }
        },
        updateInfo: function(){
            infoText.innerHTML = 'Selected element: ' + editorEntities[this.selected] + '\n Map width: ' +
                this.mapW + '\n Map height: ' + this.mapH;
        },
        hoverTile: function(e){
            var mousepos = getMousePosScreen(gameArea.canvas, e);
            var pickedTile = null;
            if(pickedTile = newMap.getTileScreen(mousepos.x, mousepos.y)){
                pickedTile.highlight = true;
            }
            this.pickedTile = pickedTile;
        },
        scrollItems: function(dir){
            this.selected += dir;
            var max = Object.keys(editorEntities).length - 1;
            if(this.selected < 0)
                this.selected = max;
            else if(this.selected >= max)
                this.selected = 0;

            this.updateInfo();
        },
        selectItem: function(num){
            if(editorEntities[num]){
                this.selected = num;
                this.updateInfo();
            }
        }
    }
    mapEditor.init();
}
