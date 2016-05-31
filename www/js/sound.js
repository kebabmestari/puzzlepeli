var _sounds = {
    
};
var _music = {
    
};

//Track currently playing
var playingTrack = null;

function playSound(name){
    if(typeof name !== 'string')
        throw 'Invalid argument for playSound';
    if(!_sounds[name]){
        console.log('Sound ' + name + ' not found');
        return;
    }
    
    _sounds[name].play();
}

function playMusic(track){
    if(typeof name !== 'string')
        throw 'Invalid argument for playMusic';
    if(!_sounds[name]){
        console.log('Track ' + name + ' not found');
        return;
    }
    
    //Stop previous track
    if(playingTrack){
        playingTrack.pause();
        playingTrack.currentTime = 0;
    }
    
    playingTrack = _music[name];
    
    playingTrack.play();
    playingTrack.addEventListener('ended', function(){
       this.currentTime = 0;
       this.play();
    });
}

function stopMusic(){
    if(playingTrack){
        playingTrack.currentTime = 0;
        playingTrack.pause();
    }
    console.log('Music stopped');
}

function pauseMusic(){
    if(playingTrack){
        playingTrack.pause();
    }
    console.log('Music paused');
}