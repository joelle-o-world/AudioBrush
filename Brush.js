audioBrush.Brush = function() {
    this.xL = -50; // a negative number
    this.xR = 50;
    this.scaleX = 1;
    this.weight = 1;

    this.hardness = 1;

    this.channelWeighting = [1,1,1,1,1,1,1,1];

    this.f = function(dX) {
        // should be a normal distribution
        //return 1/Math.sqrt(Math.pow(dX,2)/10+1);
        //console.log(1/(Math.abs(dX)/this.xR));
        return 1/(Math.abs(dX)/this.xR + 2);
    }
}

audioBrush.Brush.prototype.__defineGetter__("size", function() {
    return this.xR-this.xL;
});
audioBrush.Brush.prototype.__defineSetter__("size", function(size) {
    var sf = size/this.size;
    this.xL *= sf;
    this.xR *= sf;
    this.scaleX *= sf;
});

audioBrush.Brush.prototype.makeShape = function(x, y, disp) {
    // return an intensity/Time map
    // Array must be ordered!
    var xL = x + this.xL;
    var xR = x + this.xR;

    tL = disp.tAtX(xL);
    tR = disp.tAtX(xR);

    var relY = 1 - y/disp.box.height;

    var shape = new Array();
    for(var channel=0; channel<disp.sample.numberOfChannels; channel++) {
        if(this.channelWeighting != undefined) {
            shape[channel] = new Array();
        }
    }
    for(var t=Math.floor(tL); t<tR; t++) {
        if(!disp.sample.containsTime(t)) {
            continue;
        }

        var xi = disp.xAtT(t);
        var dX = xi - x;
        if(this.scaleX != undefined) {
            dX *= this.scaleX;
        }
        var I = this.f(dX) * this.weight;
        for(var channel in shape) {
            shape[channel][t] = I * this.channelWeighting[channel];
        }
    }
    // console.log(shape);
    return shape;
}

audioBrush.Brush.prototype.drawPreview = function(x, y, disp) {
    var ctx = disp.ctx;

    var xL = x + this.xL;
    var xR = x + this.xR;
    var yT, yB, dX, I;
    var loY, hiY;
    for(var xi=Math.floor(xL); xi<xR; xi+=3) {
        dX = xi-x;
        I = this.f(dX) * this.hardness;

        loY = disp.box.bottom;
        hiY = 0;
        for(var i=0; i<disp.graphs.length; i++) {
            if(disp.graphs[i][xi] < loY) {
                loY = disp.graphs[i][xi];
            }
            if(disp.graphs[i][xi] > hiY) {
                hiY = disp.graphs[i][xi];
            }
        }

        yT = loY-30;
        yB = hiY+30;

        ctx.globalAlpha = I*0.9  + 0.1;
        ctx.beginPath();
        ctx.strokeStyle = "#f0f";
        ctx.moveTo(xi, yT);
        ctx.lineTo(xi, yB);
        ctx.stroke();

        ctx.globalAlpha = 1;

    }

    disp.brushPreviewDrawn = true;
}

audioBrush.Brush.prototype.__defineGetter__("html", function() {
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

audioBrush.Brush.prototype.makeHtml = function() {
    var div = document.createElement("div");
    div.className = "brushinpsector";

    div.header = document.createElement("h3");
    div.header.innerText = "Brush Inspector";

    div.sizeInp = createRangeInput(0, 100);

    div.appendChild(div.header);
    div.appendChild(labelWrapInput(div.sizeInp, "size"));

    return div;
}

audioBrush.Brush.prototype.refreshHtml = function() {
    if(this._div) {
        this._div.sizeInp.value = this.size;
    }
}
audioBrush.Brush.prototype.readHtml = function() {
    if(this._div) {
        this.size = parseFloat(this._div.sizeInp.value);
    }
}
