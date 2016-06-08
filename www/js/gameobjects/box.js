/**
 * Box object constructor
 * Box that doesn't count as a goal is BOULDER!
 * @param {number} x initial x coordinate
 * @param {number} y initial y coordinate
 * @param {boolean} goal does this object count when over a goal
 * @returns {box}
 */
function box(x, y, goal){
    this.atGoal = false;
    this.countsOnGoal = goal;
    if(this.countsOnGoal === undefined)
        this.countsOnGoal = true;
    gameObject.call(this, 'box', x, y,
            this.countsOnGoal ? 'red' : 'gray', '#', null);
    console.log('Box created at ' + x + ',' + y);
}
box.prototype = Object.create(gameObject.prototype);

/**
 * Move the box to a direction
 * @param {type} dir
 */
box.prototype.move = function(dir){
    gameObject.prototype.move.call(this, dir);
    if(this.countsOnGoal)
        playSound('boxmove');
    else
        playSound('bouldermove');
};

/**
 * Sink or destroy the box
 * Fill holes
 */
box.prototype.checkDestroyAtEnd = function(){
    gameObject.prototype.checkDestroyAtEnd.call(this);
    if(currentMap.getTile(this.x, this.y).type === getTileNumber('WATER'))
        currentMap.setTile(this.x, this.y, getTileNumber('SUNKENBOX'), false);
    if(currentMap.getTile(this.x, this.y).type === getTileNumber('HOLE'))
        currentMap.setTile(this.x, this.y, getTileNumber('FILLEDHOLE'), false);
};

/**
 * Checks whether the box can move to given coordinates, aka there are
 * no other objects on the way and the hitmap is false
 * @param {type} x
 * @param {type} y
 * @returns {Boolean}
 */
box.prototype.canMoveTo = function(x, y){

    if(gameObject.prototype.canMoveTo.call(this, x, y)){
        if(currentMap.getTile(x, y).hit){
            var tileT = currentMap.getTile(x, y).type;
            if(tileT === getTileNumber('WATER') || tileT === getTileNumber('LAVA'))
                return true;
            if(!this.countsOnGoal && tileT === getTileNumber('HOLE'))
                return true;
            return false;
        }
        return true;
    } else{
        return false;
    }
};

/**
 * Checks if box is on a goal and sets the flag
 * @returns {Boolean}
 */
box.prototype.checkGoal = function(){
    if(this.countsOnGoal && currentMap.isGoal(this.x, this.y)){
        this.atGoal = true;
        return true;
    } else{
        this.atGoal = false;
        return false;
    }
};

/**
 * Check for special actions before moving, namely interaction with water
 * @returns {Boolean} false if the movement can continue
 */
box.prototype.checkSpecialCollision = function(targetX, targetY){
    //Box collision with water
    if(currentMap.getTile(targetX, targetY).type === getTileNumber('WATER')){
        playSound('box_sink');
        this.destroyAtEnd = true; //Remove box when it hits the water
        return false; //Can move
    }
    //Box destroyed in lava
    if(currentMap.getTile(targetX, targetY).type === getTileNumber('LAVA')){
        playSound('lava_sink');
        this.destroyAtEnd = true; //Remove box when it hits the water
        return false; //Can move
    }
    if(!this.countsOnGoal && currentMap.getTile(targetX, targetY).type === getTileNumber('HOLE')){
        playSound('hole_fall');
        this.destroyAtEnd = true; //Remove box when it hits the water
        return false; //Can move
    }
    return true;
}