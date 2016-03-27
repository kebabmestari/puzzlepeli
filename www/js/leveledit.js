/**
 * Created by Samuel on 3/26/2016.
 */

var mapEditor = null;
var newMap = null;

var editMode = false;

var editorEntities = {
    0 : 'bg',
    1 : 'wall',
    2 : 'box',
    3 : 'playerstart',
    4 : 'goal'
};

function initEditor(){
    mapEditor = {
        mapW: 0,
        mapH: 0,
        mapName: 'empty',
        newMapData: null,
        init: function(){
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

            //init empty tile and hitmap
            emptyTilemap = emptyMap.slice(0); emptyHitmap = emptyMap.slice(0);

            this.newMapData = new mapData(this.mapName, defaultTileset, emptyTilemap, emptyHitmap, [0, 0], []);
            newMap = new map(this.newMapData);
            console.log('Editor initialized');

            editMode = true;
        },
        drawEditor: function(){
            var temp_text = 'Selected entity: ';
            newMap.drawMap();
            draw.drawText('magenta','',0,0,true,false);
        },
        addRow: function(){
            var newLine = [];
            for(var i = 0; i < this.newMapData.tiles[0].length; i++){
                newLine.push(0);
            }
            this.newMapData.tiles.push(newLine);
            this.newMapData.hitmap.push(newLine);
            this.mapH++;
            this.updateMap();
        },
        deleteRow: function(){
            this.newMapData.tiles[this.newMapData.tiles.length-1] = [];
            this.newMapData.hitmap[this.newMapData.tiles.length-1] = [];
            this.mapH--;
            this.updateMap();
        },
        addCol: function(){
            for(var i = 0; i < this.newMapData.tiles.length; i++){
                this.newMapData.tiles[i].push(0);
                this.newMapData.hitmap[i].push(0);
            }
            this.mapW++;
            this.updateMap();
        },
        deleteCol: function(){
            for(var i = 0; i < this.newMapData.tiles.length; i++){
                this.newMapData.tiles[i][this.newMapdata.tiles[i].length-1] = [];
                this.newMapData.hitmap[i][this.newMapdata.hitmap[i].length-1] = [];
            }
            this.mapW--;
            this.updateMap();
        },
        updateMap: function(){
            newMap = new map(this.newMapData);
        },
        hoverTile: function(){

        }
    }
    mapEditor.init();
}
