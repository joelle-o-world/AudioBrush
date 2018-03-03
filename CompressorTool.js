audioBrush.CompressorTool = function() {
    audioBrush.GenericTool.call(this);
}
audioBrush.CompressorTool.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.CompressorTool.prototype.constructor = audioBrush.CompressorTool;

audioBrush.CompressorTool.prototype.preStroke = function(shape, sample, meta) {
    var samp;
    var peak = 0;
    //var n = shape.length;
    for(var c in shape) {
        for(var t in shape[c]) {
            //sum += Math.pow(sample.buffers[c][t], 2)/n;
            samp = Math.abs(sample.buffers[c][t] * shape[c][t]);
            if(samp > peak) {
                peak = samp;
            }
        }
    }

    //var rmsSum = Math.sqrt(sum);
    var ideal = Math.abs(meta.yControl-0.5)*2 * 0.8;
    meta.gainSf = peak!=0 ? ideal/peak : 1;
}

audioBrush.CompressorTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var samp = sample.buffers[channel][t];
    var samp = samp * (meta.gainSf);
    return samp;
    //console.log("y", samp);
}

audioBrush.CompressorTool.prototype.makeHtml = function() {
    var div = document.createElement("DIV");
    div.header = document.createElement("H2");
    div.header.innerText = "normaliser tool";
    div.info = document.createElement("P");
    div.info.innerHTML = "y position of mouse controls normalised level";
    div.appendChild(div.header);
    div.appendChild(div.info)
    return div;
}
