function key(x, y){
    gameObject.call(this, 'key', x, y, 'yellow', 'K', 'avainkuva');
};

key.prototype = Object.create(gameObject.prototype);