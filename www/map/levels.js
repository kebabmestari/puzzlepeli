/**
 * getMap function which encloses the maps as JSON
 */

var getMap = (function(){

    var maps = {maplist : []};

    maps.maplist[0] = 
'{"name":"newmap","tileset":"testi","tiles":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,1,0,0,0,0,1],[1,0,2,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,2,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"hitmap":[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]],"plrstart":[4,3],"objects":[{"atGoal":false,"name":"box","x":2,"y":3,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464288458522,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null},{"atGoal":false,"name":"box","x":6,"y":5,"imgW":0,"imgH":0,"drawOffsetX":0,"drawOffsetY":0,"color":"red","isAnimated":false,"animation":null,"animationFrame":0,"animationTick":1464288459518,"isMoving":false,"targetX":0,"targetY":0,"moveDir":"","char":"#","img":null}],"requiredBoxes":0}';
    return function(nro){
        return JSON.parse(maps.maplist[nro]) || 0;
    }

})();