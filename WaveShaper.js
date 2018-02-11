audioBrush.WaveShaper = function() {
    audioBrush.GenericTool.call(this);
    
    this.drive = 1;
    this.dryWet = 1;
    this.master = 0.8;
    
    this.f = function(x) {
        return Math.sin(x*Math.PI/2);
    }
}
audioBrush.WaveShaper.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.WaveShaper.prototype.constructor = audioBrush.WaveShaper;


audioBrush.WaveShaper.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var dry = sample.A(t, channel);
    var wet = this.f(dry * this.drive);
    var mix = this.dryWet * wet + (1-this.dryWet)*dry;
    return this.master * mix;
}
audioBrush.WaveShaper.prototype.y = function(dry) {
    var wet = this.f(dry * this.drive);
    var mix = audioBrush.mixDryWet(this.dryWet, dry, wet);
    return this.master * mix;
}

audioBrush.WaveShaper.prototype.makeHtml = function() {
    var div = document.createElement("div");
    div.className = "waveshaper";
    div.header = document.createElement("H2");
    div.header.innerText = "waveshaper";
    div.drive = rangeWithLabel("drive", 0, 5);
    div.dryWet = rangeWithLabel("dry/wet", 0 , 1);
    div.master = rangeWithLabel("master", 0, 1.2);
    
    div.visualiser = document.createElement("canvas");
    div.visualiser.className = "visualiser";
    div.visualiser.height = 150;
    div.visualiser.width = 150;
    
    div.appendChild(div.header);
    div.appendChild(div.visualiser);
    div.appendChild(div.drive.wrapper);
    div.appendChild(div.dryWet.wrapper);
    div.appendChild(div.master.wrapper);
    
    return div;
}

audioBrush.WaveShaper.prototype.refreshHtml = function() {
    if(this._div != undefined) {
        var div = this._div;
        div.drive.value = this.drive;
        div.dryWet.value = this.dryWet;
        div.master.value = this.master;
        
        this.refreshVisualiser();
    }
}
audioBrush.WaveShaper.prototype.refreshVisualiser = function() {
    if(this._div != undefined) {
        var canvas = this._div.visualiser;
        var ctx = canvas.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        var x, y, yP;
        for(var xP=0; xP<canvas.width; xP+=3) {
            x = (xP-canvas.width/2)/(canvas.width/2);
            y = -this.y(x);
            yP = y*canvas.height/2 + canvas.height/2;
            
            ctx.beginPath();
            ctx.strokeStyle = "#f00";
            ctx.moveTo(xP, canvas.height - canvas.height*xP/canvas.width);
            ctx.lineTo(xP, yP);
            ctx.stroke();
        }
        
        // last line;
        ctx.beginPath();
        ctx.strokeStyle = "#ccf";
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
    }
}

audioBrush.WaveShaper.prototype.readHtml = function() {
    if(this._div != undefined) {
        var div = this._div;
        this.drive = parseFloat(div.drive.value);
        this.dryWet = parseFloat(div.dryWet.value);
        this.master = parseFloat(div.master.value);
        
        this.refreshVisualiser();
    }
}
