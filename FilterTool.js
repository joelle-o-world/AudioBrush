audioBrush.FilterTool = function() {
    audioBrush.GenericTool.call(this);

    this.sampleRate = 44100;
    this.f = 20;
    this.type = "lpf";
}
audioBrush.FilterTool.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.FilterTool.prototype.constructor = audioBrush.FilterTool;

// processOneSample
audioBrush.FilterTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var preSamp = t > 1 ? sample.buffers[channel][Math.floor(t-1)] : 0;
    var nexSamp = t+1 < sample.durationInSamples ? sample.buffers[channel][Math.floor(t+1)] : 0;
    var samp = sample.buffers[channel][t];

    var mAv = this.movingAverageLength*I*meta.yControl;
    if(mAv == 0)
        return samp;

    var sum = preSamp*mAv/2 + nexSamp*mAv/2;
    sum -= sample.buffers[channel][Math.floor(t-mAv/2)] || 0;
    sum += sample.buffers[channel][Math.floor(t+mAv/2)] || 0;
    sum += samp;

    if(this.type == "lpf")
        return sum/mAv;
    else if(this.type == "hpf")
        return samp-sum/mAv;
}

audioBrush.FilterTool.prototype.cursorInfo = function(x, y, disp) {

    var mAv = this.movingAverageLength*(y/disp.canvas.height);
    var f = 0.443*this.sampleRate/mAv;
    return "cutoff = " +Math.round(f)+"Hz";
    //return f+"Hz ("+hp+")";
}

// makeHtml
audioBrush.FilterTool.prototype.makeHtml = function() {
    var div = document.createElement("div");
    div.header = document.createElement("h2");
    div.header.innerText = "Filter Tool";
    div.appendChild(div.header);

    //div.f = createRangeInput(20, 20000);

    //div.appendChild(labelWrapInput(div.f, "cut off"))

    return div;
}
// refreshHtml
// readHtml

audioBrush.FilterTool.prototype.__defineSetter__("f", function(f) {
    this.movingAverageLength = Math.ceil(0.443/(f/this.sampleRate));
});
