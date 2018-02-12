audioBrush.Sample = function(length, numberOfChannels) {
    //this.buffer = new Float32Array(length);
    if(numberOfChannels == undefined) {
        numberOfChannels = 1;
    }
    this.buffers = new Array();
    for(var channel=0; channel < numberOfChannels; channel++) {
        this.buffers[channel] = new Float32Array(length);
    }
    this.sampleRate = 44100;
    //this.bitDepth = 16;

    this.max = 0.9;
    //this.max = 32767 - 64; // minus 64 for headroom

}

audioBrush.Sample.prototype.__defineGetter__("numberOfChannels", function() {
    return this.buffers.length;
});
audioBrush.Sample.prototype.__defineGetter__("durationInSamples", function() {
    return this.buffers[0].length;
});
audioBrush.Sample.prototype.__defineGetter__("durationInSeconds", function() {
    return this.durationInSamples/this.sampleRate;
});
audioBrush.Sample.prototype.containsTime = function(t) {
    return t > 0 && t < this.durationInSamples;
}

audioBrush.Sample.prototype.rms = function(from, to, channel) {
    if(from == undefined) {
        from = 0;
    }
    if(to == undefined) {
        to = this.durationInSamples;
    }

    if(channel == undefined) {
        var sum = 0;
        for(var c=0; c<this.numberOfChannels; c++) {
            sum += Math.pow( this.rms(from,to,c), 2);
        }
        return Math.sqrt(sum/this.numberOfChannels);
    }

    var sum = 0;
    for(var t=Math.floor(from); t<to; t++) {
        sum += Math.pow(this.deScale(this.buffers[channel][t]), 2);
    }

    var mean = sum / ((to-from)*this.numberOfChannels);

    return Math.sqrt(mean);
}
audioBrush.Sample.prototype.peak = function(from, to) {
    if(from == undefined) {
        from = 0;
    }
    if(to == undefined) {
        to = this.durationInSamples;
    }

    var peak = 0;
    for(var t=Math.floor(from); t<to; t++) {
        var A = Math.abs(this.A(t));
        if(A > peak) {
            peak = A;
        }
    }

    return peak;
}

audioBrush.Sample.prototype.scale = function(n) {
    return n*this.max;
}
audioBrush.Sample.prototype.deScale = function(n) {
    return n/this.max;
}

audioBrush.Sample.prototype.A = function(t, channel) {
    // return deScaled sample value at value t, approximating linearly for non-integer values of t
    if(channel == undefined) {
        channel = 0;
    }
    if(t<0 || t>this.durationInSamples) {
        throw "attempt to read sample that does not exist";
    }
    if(t%1 == 0) {
        return this.deScale(this.buffers[channel][t]);
    } else {
        var pre = this.buffers[channel][Math.floor(t)];
        var nex = this.buffers[channel][Math.ceil(t)];
        var A = pre + (nex-pre)*(t%1);
        return this.deScale(A);
    }
}
audioBrush.Sample.prototype.setA = function(A, t, channel) {
    // set scaled sample value at time t
    if(channel == undefined) {
        channel = 0;
    }

    if(t<0 || t>this.durationInSamples) {
        throw "attempt to write sample that does not exist";
    }
    this.buffers[channel][t] = this.scale(A);
}

audioBrush.Sample.prototype.play = function() {
    /*var ctx = audioBrush.playback.ctx;
    var buffer = ctx.createBuffer(this.numberOfChannels, this.durationInSamples, this.sampleRate);

    for(var channel=0; channel<this.numberOfChannels; channel++) {
        var data = buffer.getChannelData(channel);
        for(var t=0; t<data.length; t++) {
            data[t] = this.A(t, channel);
        }
    }

    audioBrush.playback.stop();

    var source = ctx.createBufferSource();
    source.buffer = buffer;

    audioBrush.playback.nowPlaying = source;

    source.connect(audioBrush.playback.master);
    source.start();*/
    audioBrush.playback.play(this);
}

audioBrush.Sample.prototype.loadFromFile = function(filename) {
    var request = new XMLHttpRequest();
    request.open("get", filename, true);
    request.responseType = "arraybuffer";
    request.sample = this;
    request.onload = function() {
        audioBrush.playback.ctx.decodeAudioData(this.response).then(function(buffer) {
            for(var channel=0; channel<buffer.numberOfChannels; channel++) {
                this.sample.buffers[channel] = buffer.getChannelData(channel);
            }
        }.bind(this));
    }
    request.send();
}
audioBrush.Sample.prototype.loadFromArrayBuffer = function(buffer) {
    var samp = this;
    console.log(buffer);
    samp.buffers = [];
    audioBrush.playback.ctx.decodeAudioData(buffer).then(function(buffer) {
        console.log(buffer);
        for(var channel=0; channel<buffer.numberOfChannels; channel++) {
            samp.buffers[channel] = buffer.getChannelData(channel);
        }
    });
}
audioBrush.Sample.prototype.toAudioBuffer = function() {
    var buffer = audioBrush.playback.ctx.createBuffer(this.numberOfChannels, this.durationInSamples, this.sampleRate);
    for(var channel=0; channel<buffer.numberOfChannels; channel++) {
        buffer.copyToChannel(this.buffers[channel], channel);
    }
    return buffer;
}
