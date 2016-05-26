/**
 * Box object constructor
 * @param {number} x initial x coordinate
 * @param {number} y initial y coordinate
 * @returns {box}
 */

function box(x, y){
    this.atGoal = false;
    
    gameObject.call(this, 'box', x, y, 'red', '#', null);

    console.log('Box created at ' + x + ',' + y);
}
box.prototype = Object.create(gameObject.prototype);

box.prototype.canMoveTo = function(x, y){
    var l = currentMap.objects.length;
    for(var i = 0; i < l; i++){
        var tempObj = currentMap.objects[i];
        if((tempObj !== this) && (tempObj.x === x && tempObj.y === y)){
            return false;
        }
        if(currentMap.getTile(x, y).hit){
            return false;
        }
    }
    return true;
};

box.prototype.checkGoal = function(){
    if(currentMap.isGoal(this.x, this.y)){
        this.atGoal = true;
        return true;
    } else{
        this.atGoal = false;
        return false;
    }
};