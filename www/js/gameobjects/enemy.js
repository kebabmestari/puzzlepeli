var ENEMYTYPE = {
    BACKANDFORTH : 1,
    TURNSRIGHT : 2
};

var defEnemySpeed = 1000;

function enemy(x, y, type, initialdir, speed, canmoveboxes){
    gameObject.call(this, 'player', x, y, 'green', 'E', null);
    
    //Prevents stack overflow/endless loop when stuck
    this.wallTurnsPerUpdate = 0;

    this.type = type;
    this.name = 'enemy';
    
    //Right if not defined
    this.dir = initialdir || 'right';
    this.moveTick = Date.now();
    this.canMoveBoxes = canmoveboxes || false;
    this.speed = speed || defEnemySpeed;
    
    console.log('Enemy created');
}

enemy.prototype = Object.create(playerObj.prototype);

enemy.prototype.updateMovement = function(){
    this.wallTurnsPerUpdate = 0;
    gameObject.prototype.updateMovement.call(this);
    if((Date.now() - this.moveTick) >= this.speed){
        this.moveTick = Date.now();
        this.move(this.dir);
    }
};

enemy.move = function(){
    switch(this.dir){
        case 'right':
            player.prototype.move.call(this, this.x + 1, this.y);
            break;
        case 'left':
            player.prototype.move.call(this, this.x - 1, this.y);
            break;
        case 'up':
            player.prototype.move.call(this, this.x, this.y - 1);
            break;
        case 'down':
            player.prototype.move.call(this, this.x, this.y + 1);
            break;
    }
}

/**
 * Handles turning when colliding with walls
 */
enemy.prototype.handleWallTurning = function(){
    if(this.type === ENEMYTYPE.BACKANDFORTH){
        switch(this.dir){
            case 'right':
                this.dir = 'left';
                break;
            case 'left':
                this.dir = 'right';
                break;
            case 'up':
                this.dir = 'down';
                break;
            case 'down':
                this.dir = 'up';
                break;
        }
    } else if(this.type === ENEMYTYPE.TURNSRIGHT){
        switch(this.dir){
            case 'right':
                this.dir = 'down';
                break;
            case 'down':
                this.dir = 'left';
                break;
            case 'left':
                this.dir = 'up';
                break;
            case 'up':
                this.dir = 'right';
                break;
        }
    } else{
        throw 'Invalid enemy type in handleWallTurning';
    }
    
    //Prevent stack overflow if enemy is stuck
    if(this.wallTurnsPerUpdate === 0){
        this.wallTurnsPerUpdate++;
        gameObject.prototype.move.call(this, this.dir);
    }
    
};

/**
 * Creates and returns a new enemy object
 * @param {type} x
 * @param {type} y
 * @param {type} type Type of the enemy
 * @param {type} direction Initial direction, default if null
 * @returns {enemy}
 */
function createEnemy(x, y, type, direction){
    var newEnemy = null;
    var initialDir = direction || null;
    if(!direction)
        if(type === ENEMYTYPE.BACKANDFORTH)
            initialDir = 'right';
        else
            initialDir = 'right';
    newEnemy = new enemy(x, y, type || ENEMYTYPE.BACKANDFORTH, initialDir, defEnemySpeed, false);
    return newEnemy;
}