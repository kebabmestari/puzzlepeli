//Animation object
function animation(name, frameW, frameH, frames, speed, startFrame){

    this.name = name;
    this.frameW = frameW;
    this.frameH = frameH;
    this.frames = frames;
    this.startFrame = startFrame || 0;
    this.speed = speed; //Length of one frame

    window.animations.push(this);

    console.log('Animation ' + this.name + ' created');
}

/**
 * Checks for animation frame change against a given tick
 * @param {number} tick Animation tick into which the speed is compared into
 * @returns {Number} Returns positive tick count if the frame is to change, 0 otherwise
 */
animation.prototype.isFrameChange = function(tick){
    var aTick = (Date.now() - +tick);
    if(aTick >= this.speed)
        return aTick - this.speed;
    else
        return 0;
};

//Removes all of the specific objects from the level
function removeAll(obj){
    for(var i in currentMap.objects){
        if(currentMap.objects[i].name === obj){
            
        }
    }
}

/**
 * Adds an object to the inventory
 * @param {gameObject} obj
 */
function addToInventory(obj){
    if(window.inventory.indexOf(obj) != -1)
        throw 'Cannot add duplicates to inventory';
    window.inventory.push(obj);
    console.log('Added ' + obj.name + 'to inventory');
}

function removeFromInventory(obj){
    var ind = inventory.indexOf(obj);
    if(obj != -1){
        inventory.splice(ind, 1);
    }
    console.log('Removed item ' + obj.name + ' from inventory');
}

/**
 * Checks inventory for a named item and returns it
 * @param {string} name type of the object
 * @returns {gameObject}
 */
function checkInventory(name){
    for(var i = 0, l = window.inventory.length; i < l; i++){
        if(window.inventory[i].name === name)
            return window.inventory[i];
    }
    return null;
}

//Clear inventory
function clearInventory(){
    window.inventory = [];
    console.log('Inventory cleared');
}

/**
 * Handles player's collisions to objects other than boxes
 */
function handleCollisions(){
    for(var o in currentMap.objects){
        if(player.isColliding(currentMap.objects[o])){
            var obj = currentMap.objects[o];
            switch (obj.name) {
                case 'key':
                    addToInventory(obj);
                    currentMap.removeObject(obj);
                    playSound('key');
                    break;
                    
                default:
                    break;
            }
        }
    }
}