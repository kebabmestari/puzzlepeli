/**
 * Key constructor
 * @param {number} x
 * @param {number} y
 * @param {number} type Type of the key, opens the corresponding door
 * @returns {key}
 */
function key(x, y, type){
    this.type = type || 1;;
    
    gameObject.call(this, 'key', x, y, 'yellow', 'K', 'avainkuva');
};

key.prototype = Object.create(gameObject.prototype);