audioBrush.BitCrusher = function() {
    audioBrush.GenericTool.call(this);

    this.bitDepth = 4;
    this.srr = 2; // sample rate reduction
}
audioBrush.BitCrusher.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.BitCrusher.prototype.constructor = audioBrush.BitCrusher;

audioBrush.BitCrusher.prototype.__defineGetter__("bitDepth", function() {
    return Math.log(2/this.division)/Math.log(2);
});
audioBrush.BitCrusher.prototype.__defineSetter__("bitDepth", function(bd) {
   this.division = 2/Math.pow(2, bd);
});


audioBrush.BitCrusher.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var dry = sample.buffers[channel][Math.round(t)] || 0;
    t = Math.round(t/this.srr)*this.srr;
    var wet = Math.round(sample.A(t, channel)/this.division)*this.division;
    return audioBrush.mixDryWet(1-meta.yControl, dry, wet);
}

audioBrush.BitCrusher.prototype.makeHtml = function() {
    var div = document.createElement("div");
    div.className = "bitcrusher";

    div.header = document.createElement("h2");
    div.header.innerText = "Bit Crusher";
    div.bitDepth = createRangeInput(1, 16, 16);
    div.srr = createRangeInput(1,8, 64);

    div.appendChild(div.header);
    div.appendChild(labelWrapInput(div.bitDepth, "Bit depth", "bitdepth"));
    div.appendChild(labelWrapInput(div.srr, "Sample Rate Reduction", "srr"));

    return div;
}

audioBrush.BitCrusher.prototype.refreshHtml = function() {
    if(this._div) {
        this._div.bitDepth.value = this.bitDepth;
        this._div.srr.value = this.srr;
    }
}
audioBrush.BitCrusher.prototype.readHtml = function() {
    if(this._div) {
        this.bitDepth = parseFloat(this._div.bitDepth.value);
        this.srr = parseFloat(this._div.srr.value);
    }
}
