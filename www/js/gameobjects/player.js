/**
 * Player object constructor
 * @param {number} x Initial X coordinate
 * @param {number} y Initial Y coordinate
 * @returns {playerObj} new player
 */

function playerObj(x, y){
    gameObject.call(this, 'player', x, y, 'green', '@', 'pelaajakuva');

    this.move = function(x, y){
        gameObject.prototype.move.call(this, x, y);
        var l = currentMap.objects.length;
        for(var i = 0; i < l; i++){
            var tempObj = currentMap.objects[i];
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
                }else{
                    this.isMoving = false;
                    this.targetX = this.x;
                    this.targetY = this.y;
                }
            }
        }
    };

    console.log('Player created at ' + x + ',' + y);
}
playerObj.prototype = Object.create(gameObject.prototype);