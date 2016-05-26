/**
 * Functions for loading map files with AJAX
 */

'use strict';

var mapfolder = 'map/';

function doGET(target, source, local){

    if(typeof source !== 'string')
        throw 'Invalid GET source';
    
    var status = (local ? 0 : 200);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState === 4 &&
                xhttp.status === status){
            target.val.set(xhttp.responseText);
        }
    };
    xhttp.open('GET', source, true);
    xhttp.send();
    console.log('Request sent for ' + source);
}

function loadMapFile(filename, target, local){
    
//    if(typeof callback !== 'object')
//        throw 'Invalid target for AJAX map loading';

    var responsetext = {};
    Object.defineProperty(responsetext, 'text', {
        get : function(){
            return textVal;
        },
        set : function(e){
            textVal = JSON.parse(e);
            var newmapdata = new mapData();
            for(var i in e){
                newmapdata[i] = e[i];
            }
            console.log('Received map parsed, name: ' + newmapdata.name);
            target = newmapdata;
            return;
        }
    });
    
    console.log('Sending request for map ' + filename);
    
    doGET(responsetext, (local ? './' + mapfolder : '') + filename, local);
}