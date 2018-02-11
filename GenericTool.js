audioBrush.GenericTool = function() {
}

audioBrush.GenericTool.prototype.stroke = function(shape, sample, meta) {
    if(this.preStroke) {
        this.preStroke(shape, sample, meta);
    }
    
    var wet, dry, mix;
    for(var channel in shape) {
        for(var t in shape[channel]) { // acuerde! los `shape`s no tiene que empezar a cero
            t = parseInt(t);
            
            wet = this.processOneSample(t, channel, sample, meta, shape[channel][t]);
            dry = sample.A(t, channel);
            mix = audioBrush.mixDryWet(shape[channel][t], dry, wet);
            sample.setA(mix, t, channel);
        }
    }
    
    if(this.postStroke) {
        this.postStroke(shape, sample, meta);
    }
}

audioBrush.GenericTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    // return the wet value for one sample, this function is usually replaced in heirs of GenericTool
    return sample.A(t, channel);
}

audioBrush.GenericTool.prototype.cursorInfo = function(x, y, disp) {
    t = disp.tAtX(x)/44100;
    return audioBrush.formatSeconds(t);
}

audioBrush.GenericTool.prototype.__defineGetter__("html", function() {
    if(this._div != undefined) {
        return this._div;
    } else {
        
        this._div = this.makeHtml();
        
        this._div.owner = this;
        this._div.addEventListener("mousemove", function() {
            if(this.owner.readHtml) {
                this.owner.readHtml();
            }
        }, true);
        this._div.addEventListener("change", function() {
            if(this.owner.readHtml) {
                this.owner.readHtml();
            }
        }, true);
        
        
        if(this.refreshHtml) {
            this.refreshHtml();
        }
        return this._div;
    }
});

audioBrush.GenericTool.prototype.makeHtml = function() {
    var div = document.createElement("div");
    div.innerHTML = "<b>There is no inspector for this tool yet</b>";
    return div;
}



// getter: html
// function: readHtml();
// function: refreshHtml();
// function: cursorInfo(x, y, disp);