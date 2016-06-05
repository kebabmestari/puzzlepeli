/**
 * getMap function which encloses the maps as JSON
 */

var getMap = (function(){

    var maps = {maplist : []};

    maps.maplist[0] = 
'{"name":"newmap","tileset":"testi","tiles":[[1,1,1,4,4,4,1,1,1,1],[1,0,0,1,0,0,0,0,0,1],[1,0,2,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,2,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,3,0,0,0,0,0,1],[1,0,0,3,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"hitmap":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"plrstart":[4,4],"objects":[{"name":"enemy1","x":6,"y":4,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"green","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1465072327298,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","destroyAtEnd":false,"char":"E","img":null,"type":1,"dir":"right","moveTick":1465072327302,"canMoveBoxes":false,"speed":1000},{"atGoal":false,"name":"box","x":6,"y":6,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464341670543,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null},{"atGoal":false,"name":"box","x":6,"y":3,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464341673748,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null},{"name":"key","x":7,"y":8,"drawOffsetX":0,"drawOffsetY":0,"color":"yellow","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464341693155,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"K","img":{}}],"requiredBoxes":"2"}';

    return function(nro){
        return JSON.parse(maps.maplist[nro]) || 0;
    }

})();