audioBrush.GainTool = function() {
    audioBrush.GenericTool.call(this);
}
audioBrush.GainTool.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.GainTool.prototype.constructor = audioBrush.GainTool;

audioBrush.GainTool.prototype.preStroke = function(shape, sample, meta) {
    meta.gainSf = 1 - (meta.yControl-0.5)/2;
}
audioBrush.GainTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    return sample.buffers[channel][t] * meta.gainSf;
}
