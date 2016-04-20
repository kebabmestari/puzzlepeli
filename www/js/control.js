"use strict";

var keyScheme = {
	LEFT: 	37,
	UP:		38,
	RIGHT:  39,
	DOWN:   40,
    EDIT:   69,
    ADDROW: 103,
    DELETEROW: 100,
    ADDCOL: 105,
    DELETECOL: 102,
    NEXTITEM: 107,
    PREVITEM: 109
};

function handleKeys(event){

	var keynum = 0;

    if(window.event) {                 
      keynum = event.keyCode;
    } else if(event.which){               
      keynum = event.which;
    }

    if(keynum === keyScheme.LEFT) {
        if(!editMode)
            movePlayer('left');
        else
            camera.x -= CAMERASPEED;
    }
    else if(keynum === keyScheme.UP) {
        if(!editMode)
            movePlayer('up');
        else
            camera.y -= CAMERASPEED;
    }
    else if(keynum === keyScheme.RIGHT) {
        if(!editMode)
            movePlayer('right');
        else
            camera.x += CAMERASPEED;
    }
    else if(keynum === keyScheme.DOWN) {
        if(!editMode)
            movePlayer('down');
        else
            camera.y += CAMERASPEED;
    }
    else if(keynum == keyScheme.EDIT){
        currentMap = null;
        initEditor();
    }
    else if(keynum == keyScheme.ADDROW && editMode){
        mapEditor.addRow();
    }
    else if(keynum == keyScheme.DELETEROW && editMode){
        mapEditor.deleteRow();
    }
    else if(keynum == keyScheme.ADDCOL && editMode){
        mapEditor.addCol();
    }
    else if(keynum == keyScheme.DELETECOL && editMode){
        mapEditor.deleteCol();
    }
    else if(keynum == keyScheme.NEXTITEM && editMode){
        mapEditor.scrollItems(1);
    }
    else if(keynum == keyScheme.PREVITEM && editMode){
        mapEditor.scrollItems(-1);
    }
    else if(keynum >= 49 && keynum <= 57 && editMode){
        mapEditor.selectItem(keynum - 49);
    }

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

//Return mouse position on canvas
function getMousePosScreen(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

//Return mouse position on canvas
function getMousePosWorld(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left + camera.x,
        y: evt.clientY - rect.top + camera.y
    };
}