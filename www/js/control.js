"use strict";

var keyScheme = {
	LEFT: 	37,
	UP:		38,
	RIGHT:  39,
	DOWN:   40
};

function handleKeys(event){

	var keynum = 0;

    if(window.event) {                 
      keynum = event.keyCode;
    } else if(event.which){               
      keynum = event.which;
    }

    if(keynum === keyScheme.LEFT)
    	movePlayer('left')
    else if(keynum === keyScheme.UP)
    	movePlayer('up')
    else if(keynum === keyScheme.RIGHT)
    	movePlayer('right')
    else if(keynum === keyScheme.DOWN)
    	movePlayer('down')

	console.log('Key ' + keynum + ' pressed');
}

function movePlayer(dir){
	if(!player.isMoving)
		player.move(dir);
}