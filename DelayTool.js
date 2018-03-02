audioBrush.DelayTool = function() {
    audioBrush.GenericTool.call(this);
    this.tap = 44100*2;
    //do
    //    this.taps.push(Math.random()*441000);
    //while(Math.random()<0.8)
    console.log(this.taps);
}
audioBrush.DelayTool.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.DelayTool.prototype.constructor = audioBrush.DelayTool;

audioBrush.DelayTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var samp = sample.buffers[channel][Math.floor(t)] || 0;
    wet = sample.buffers[channel][Math.round(t-this.tap*(1-meta.yControl*2))] || 0;
    return samp + wet*0.5;
}
audioBrush.DelayTool.prototype.cursorInfo = function(x, y, disp) {
    var yControl = y/disp.canvas.height;
    var sampleDelay = -this.tap*(1-yControl*2);
    return "delay = "+Math.round(sampleDelay/disp.sample.sampleRate*1000) + "ms";
}

audioBrush.DelayTool.prototype.makeHtml = function() {
    var div = document.createElement("DIV");
    div.header = document.createElement("H2");
    div.header.innerText = "Delay/Pattern-Stamp Tool";
    div.appendChild(div.header);
    return div;
}
