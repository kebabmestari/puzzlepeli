/**
 * Player object constructor
 * @param {number} x Initial X coordinate
 * @param {number} y Initial Y coordinate
 * @returns {playerObj} new player
 */

function playerObj(x, y){
    gameObject.call(this, 'player', x, y, 'green', '@', 'pelaajakuva');

    console.log('Player created at ' + x + ',' + y);
}
playerObj.prototype = Object.create(gameObject.prototype);

playerObj.prototype.move = function(x, y){
    
    gameObject.prototype.move.call(this, x, y);

    if(this.name === 'player')
        this.moveBoxes();

};
/**
 * Move boxes out of the way
 * @returns {undefined}
 */
playerObj.prototype.moveBoxes = function(){
    
    var l = currentMap.objects.length;
    
    if(this.name === 'enemy' && !this.canMoveBoxes){
    } else{
        //Move boxes out of the way
        for(var i = 0; i < l; i++){
            var tempObj = currentMap.objects[i];
            if(tempObj.name !== 'box') continue;
            if(tempObj.x === this.targetX && tempObj.y === this.targetY){
                var boxTargetX = tempObj.x, boxTargetY = tempObj.y;
                switch(this.moveDir){
                    case 'up':
                        boxTargetY -= 1;
                        break;
                    case 'right':
                        boxTargetX += 1;
                        break;
                    case 'down':
                        boxTargetY += 1;
                        break;
                    case 'left':
                        boxTargetX -= 1;
                        break;
                }
                if(tempObj.canMoveTo(boxTargetX, boxTargetY)){
                    tempObj.move(this.moveDir);
                    return true;
                }else{
                    if(this.name === 'enemy')
                        return false;
                    this.isMoving = false;
                    this.targetX = this.x;
                    this.targetY = this.y;
                }
            }
        }
    }
    return false;
};

//Handle special wall collisions like doors
playerObj.prototype.checkWallCollision = function(x, y){
    var door = getTileType('DOOR');
    console.log(door + " " + x + " " + y);
    //Door opening
    if(currentMap.getTile(x, y).type === door){
        var temp = checkInventory('key');
        if(temp){
            currentMap.setTile(x, y, 0, false);
            removeFromInventory(temp);
            playSound('door_open');
            console.log('Opened door');
        }
    }
    
    return true;
};