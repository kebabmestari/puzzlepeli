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
    	movePlayer('left');
    else if(keynum === keyScheme.UP)
    	movePlayer('up');
    else if(keynum === keyScheme.RIGHT)
    	movePlayer('right');
    else if(keynum === keyScheme.DOWN)
    	movePlayer('down');

	console.log('Key ' + keynum + ' pressed');
}

function handleSwipe(dir){
    switch(dir){
        case 'up':
            movePlayer('up');
            break;
        case 'down':
            movePlayer('down');
            break;
        case 'left':
            movePlayer('left');
            break;
        case 'right':
            movePlayer('right');
            break;
    }
}

function movePlayer(dir){
	if(!player.isMoving){
		player.move(dir);
    }
}

function swipeDetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 50,
    restraint = 100, 
    allowedTime = 300,
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){};
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        swipedir = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    }, false);
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault();
    }, false);
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipedir = (distX < 0)? 'left' : 'right';
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                swipedir = (distY < 0)? 'up' : 'down';
            }
        }
        handleswipe(swipedir);
        e.preventDefault();
    }, false);
}