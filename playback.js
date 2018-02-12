audioBrush.playback = new Object();

audioBrush.playback.ctx = new AudioContext();
audioBrush.playback.master = audioBrush.playback.ctx.createGain();
audioBrush.playback.master.connect(audioBrush.playback.ctx.destination);

audioBrush.playback.play = function(sample, loop) {
    var ctx = this.ctx;

    /*var buffer = ctx.createBuffer(sample.numberOfChannels, sample.durationInSamples, sample.sampleRate);
    for(var channel=0; channel<sample.numberOfChannels; channel++) {
        var data = buffer.getChannelData(channel);
        for(var t=0; t<data.length; t++) {
            data[t] = sample.A(t, channel);
        }
    }*/
    var buffer = sample.toAudioBuffer();

    this.stop();

    var source = ctx.createBufferSource();
    source.buffer = buffer;

    this.nowPlaying = source;

    if(loop) {
        source.onended = function() {
            audioBrush.playback.play(sample, true);
        }
    } else {
        source.onended = function() {
            audioBrush.playback.stop();
        }
    }

    this.startedPlayingT = this.ctx.currentTime;
    this.cursorTimer = setInterval(function() {
        var t = audioBrush.playback.ctx.currentTime-audioBrush.playback.startedPlayingT;
        disp.drawPlaybackCursor(t * disp.sample.sampleRate);
    }, 10);

    source.connect(this.master);
    source.start();
}
audioBrush.playback.stop = function() {
    if(this.nowPlaying) {
        this.nowPlaying.onended = undefined;
        this.nowPlaying.stop();
        this.nowPlaying = undefined;
    }
    if(this.cursorTimer) {
        clearInterval(this.cursorTimer);
        delete this.cursorTimer;
        disp.redraw();
    }
}
