audioBrush.WaveDisplay = function() {
    this.ctx = undefined;
    this.canvas = undefined;
    this.box;

    this.startT;
    this.endT;
    this.sample = undefined;

    this.resolution = 1;
    //this.rmsMapColor = "#333";

    this.brushPreviewDrawn = false;

    this.inGesture = false;
    this.gesture = new Array();

    this.ongesturecomplete = function(gesture) {
        this.flushGesture();
    }
    this.ongesturemove = function(segment) {
    }
}

audioBrush.WaveDisplay.prototype.colors = {
    0: "#000", // L (mono)
    1: "#F99", // R
    2: "#0F0", // Center
    3: "#F0F", // Subwoofer
    4: "#00F", // rear L
    5: "#FFF", // rear R
    6: "#831", // alt rear L
    7: "#FE8", // alt rear R
    "rms": "#333",
    "equilibriumLine": "#bbb"
};
audioBrush.WaveDisplay.prototype.__defineGetter__("sample", function() {
    return this._sample;
});
audioBrush.WaveDisplay.prototype.__defineSetter__("sample", function(sample) {
    this._sample = sample;
    if(sample != undefined) {
        this.startT = 0;
        this.endT = sample.durationInSamples;
    } else {
        this.startT = undefined;
        this.endT = undefined;
    }
});
audioBrush.WaveDisplay.prototype.__defineGetter__("startTInSeconds", function() {
    return this.startT / this.sample.sampleRate;
});
audioBrush.WaveDisplay.prototype.__defineGetter__("endTInSeconds", function() {
    return this.endT / this.sample.sampleRate;
});
audioBrush.WaveDisplay.prototype.__defineGetter__("durationInSamples", function() {
    return this.endT - this.startT;
});
audioBrush.WaveDisplay.prototype.__defineGetter__("durationInSeconds", function() {
    return this.durationInSamples/this.sample.sampleRate;
});
audioBrush.WaveDisplay.prototype.tAtX = function(x) {
    return (x-this.box.left)*(this.durationInSamples/this.box.width) + this.startT;
}
audioBrush.WaveDisplay.prototype.xAtT = function(t) {
    return (t-this.startT)*(this.box.width/this.durationInSamples) + this.box.left;
}

audioBrush.WaveDisplay.prototype.__defineGetter__("samplesPerPixel", function() {
    return this.durationInSamples/this.box.width;
});
audioBrush.WaveDisplay.prototype.__defineGetter__("pixelsPerSample", function() {
    return this.box.width/this.durationInSamples;
});

audioBrush.WaveDisplay.prototype.__defineGetter__("secondsPerPixel", function() {
    return this.durationInSeconds/this.box.width;
});
audioBrush.WaveDisplay.prototype.__defineGetter__("pixelsPerSecond", function() {
    return this.box.width/this.durationInSeconds;
});

audioBrush.WaveDisplay.prototype.makeCanvas = function() {
    var canvas = document.createElement("CANVAS");
    this.adoptCanvas(canvas);
    return this.canvas;
}
audioBrush.WaveDisplay.prototype.adoptCanvas = function(canvas) {
    this.canvas = canvas;
    if(this.canvas.waveDisplays == undefined) {
        this.canvas.waveDisplays = new Array();
    }
    this.canvas.waveDisplays.push(this);
    this.ctx = this.canvas.getContext("2d");
    //this.box = new audioBrush.BoundingBox(0, canvas.width, 0, canvas.height);
    this.measureBox();
    this.canvas.addEventListener("wheel", this, false);
    this.canvas.addEventListener("mousedown", this, false);
    this.canvas.addEventListener("mousemove", this, false);
    this.canvas.addEventListener("mouseup", this, false);
}
audioBrush.WaveDisplay.prototype.measureBox = function() {
    this.box = new audioBrush.BoundingBox(0, this.canvas.width, 0, this.canvas.height);
    return this.box;
}


console.log("problems with missing samples, probably comes from using audioBrush.WaveDisplay.prototype.tAtX()");
audioBrush.WaveDisplay.prototype.handleEvent = function(event) {
    if(event.clientX && event.clientY) {
        var rect = this.canvas.getBoundingClientRect();
        var mouseX = event.clientX-rect.left;
        var mouseY = event.clientY-rect.top;
    }

    if(event.constructor == WheelEvent && this.box.containsPoint(mouseX, mouseY)) {
        this.zoom( 1 * Math.pow(1.01, event.deltaY) , this.tAtX(mouseX));
        this.transport( event.deltaX * this.samplesPerPixel );

        this.recalculateAndRedraw();
        event.preventDefault();
    } else if(event.constructor == MouseEvent && this.box.containsPoint(mouseX, mouseY)) {

        if(event.buttons == 1 && this.inGesture == false) {
            // press
            this.inGesture = true;
            this.gesture = new Array();

            var seg = new audioBrush.LineSegment();
            seg.tA = this.tAtX(mouseX);
            seg.relYA = this.AAtY(mouseY);
            seg.stampA = event.timeStamp;
            seg.xA = mouseX;
            seg.yA = mouseY;
            this.currentSeg = seg;
        } else if (event.buttons == 1 && this.inGesture == true) {
            // mousemove
            var seg = this.currentSeg;
            seg.tB = this.tAtX(mouseX);
            seg.relYB = this.AAtY(mouseY);
            seg.stampB = event.timeStamp;
            seg.xB = mouseX;
            seg.yB = mouseY;
            seg.calculate();
            this.gesture.push(seg);
            if(this.ongesturemove != undefined) {
                this.ongesturemove(seg);
            }

            seg = new audioBrush.LineSegment();
            seg.tA = this.tAtX(mouseX);
            seg.relYA = this.AAtY(mouseY);
            seg.stampA = event.timeStamp;
            seg.xA = mouseX;
            seg.xB = mouseY;
            this.currentSeg = seg;

        } else if(event.buttons == 0 && this.inGesture == true) {
            // release
            this.inGesture = false;
            //this.flushGesture();
            if(this.ongesturecomplete != undefined) {
                this.ongesturecomplete(this.gesture);
            }
        }

        if(audioBrush.selectedBrush != undefined) {
            if(this.brushPreviewDrawn) {
                this.redraw();
            }
            audioBrush.selectedBrush.drawPreview(mouseX, mouseY, this);
        }
    }
}
audioBrush.WaveDisplay.prototype.flushGesture = function() {
    this.currentSeg = undefined;
    this.gesture = new Array();
}

audioBrush.WaveDisplay.prototype.yAtX = function(x, channel) {
    var t = this.tAtX(x);
    var A = this.sample.A(t, channel); // takes care of defaulting undefined channel to 0
    return this.yAtA(A);
}
audioBrush.WaveDisplay.prototype.AAtY = function(y) {
    return (y-this.box.midY)/(this.box.height/2);
}
audioBrush.WaveDisplay.prototype.yAtA = function(A) {
    return this.box.midY - A*(this.box.height/2);
}

audioBrush.WaveDisplay.prototype.calculateGraph = function() {
    if(this.samplesPerPixel <= 20) {
        this.graphType = "waveform";

        //this.graph = new Array();
        //this.graph2 = undefined;

        this.graphs = new Array();

        var t, A, y;
        for(var channel=0; channel<this.sample.numberOfChannels; channel++) {
            this.graphs[channel] = new Array();
            for(var x=this.box.left; x<this.box.right; x+=this.resolution) {
                t = this.tAtX(x);
                A = this.sample.A(t, channel);
                y = this.yAtA(A);
                this.graphs[channel][x] = y;
            }
        }
    } else {
        this.graphType = "rms";

        this.graphs = [ new Array(), new Array ];
        //this.graph = new Array();
        //this.graph2 = new Array();

        var t, u, rms, y1, y2;
        for(var x=this.box.left; x<this.box.right; x+=this.resolution) {
            t = this.tAtX(x);
            u = this.tAtX(x+1);

            rms = this.sample.rms(t, u);
            //var peak = this.sample.peak(t, u);

            y1 = this.box.midY - rms*this.box.height/2;
            y2 = this.box.midY + rms*this.box.height/2;

            this.graphs[0][x] = y1;
            this.graphs[1][x] = y2;
        }
    }
    return this;
}

audioBrush.WaveDisplay.prototype.drawGraph = function() {
    // draw the precalculated waveform graph

    // equilibrium line
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.colors.equilibriumLine;
    this.ctx.moveTo(this.box.left, this.box.midY);
    this.ctx.lineTo(this.box.right, this.box.midY);
    this.ctx.stroke();

    if(this.graphType == "waveform") {
        for(var channel=0; channel<this.sample.numberOfChannels; channel++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.colors[channel];
            this.ctx.moveTo(this.box.left, this.graphs[channel][0]);
            for(var x in this.graphs[channel]) {
                this.ctx.lineTo(x, this.graphs[channel][x]);
            }
            this.ctx.stroke();
        }
    } else if(this.graphType == "rms") {
        this.ctx.strokeStyle = this.colors.rms;
        for(var x in this.graphs[0]) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.graphs[0][x]);
            this.ctx.lineTo(x, this.graphs[1][x]);
            this.ctx.stroke();
        }
    } else {
        throw "can't draw graph of unknown type";
    }
}

audioBrush.WaveDisplay.prototype.drawRulers = function() {
    var base = 16;
    var division,divisionWidth, n, x;
    for(var zeroes=10; zeroes>=0; zeroes--) {
        division = Math.pow(base, zeroes);
        divisionWidth = division/this.samplesPerPixel;
        n = this.durationInSamples/division;
        if(divisionWidth > 5) {
            for(var t=Math.ceil(this.startT/division)*division; t<this.endT; t+=division) {
                x = this.xAtT(t);
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#000";
                this.ctx.moveTo(x, this.box.bottom);
                this.ctx.lineTo(x, this.box.bottom-(zeroes+2)*5);
                this.ctx.stroke();

                if(division == 1) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = "#eee";
                    this.ctx.moveTo(x, this.box.bottom - 25);
                    this.ctx.lineTo(x, this.yAtX(x)+5);
                    this.ctx.stroke();

                    if(this.pixelsPerSample > 40) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = "#666";
                        this.ctx.textAlign = "center";
                        var sampValTxt = Math.round(this.sample.A(t) * 32768).toString(16).toUpperCase();
                        this.ctx.strokeText(sampValTxt, x, this.yAtX(x)-10);
                    }
                }

                if(divisionWidth > 50 && t%(division*base) != 0) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = "#000";
                    this.ctx.textAlign = "left";
                    this.ctx.strokeText("0x" + t.toString(16).toUpperCase(), x+1, this.box.bottom-(zeroes+2)*5);
                }
            }
        }
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeText("sample:", this.box.left, this.box.bottom-10);

    var alreadyLabelled = new Array();
    base = 10;
    for(var zeroes=0; zeroes>=-5; zeroes--) {
        division = Math.pow(base, zeroes);
        divisionWidth = division/this.secondsPerPixel;
        n = this.durationInSeconds/division;
        if(divisionWidth > 5) {
            for(var t=Math.ceil(this.startTInSeconds/division)*division; t<this.endTInSeconds; t+=division) {
                x = this.xAtT(t*this.sample.sampleRate);
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#000";
                this.ctx.moveTo(x, this.box.top);
                this.ctx.lineTo(x, this.box.top+(zeroes+5)*5);
                this.ctx.stroke();

                var label = audioBrush.formatSeconds(t);
                if(divisionWidth>50 && alreadyLabelled.indexOf(label) == -1) {
                    alreadyLabelled.push(label);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = "#000";
                    this.ctx.strokeText(label, x, this.box.top+(zeroes+5)*5+7);
                }
            }
        }
    }
}

audioBrush.WaveDisplay.prototype.drawPlaybackCursor = function(t) {
    if(this.playbackCursorDrawn)
        this.redraw();

    var x = this.xAtT(t);
    if(x >= 0 && x < this.canvas.width) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ff0"
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
        this.playbackCursorDrawn = true;
    }
}

audioBrush.WaveDisplay.prototype.clear = function() {
    this.ctx.clearRect(this.box.left, this.box.top, this.box.width, this.box.height);
}
audioBrush.WaveDisplay.prototype.redraw = function() {
    this.clear();
    //this.drawWaveform();
    //this.calculateGraph();
    this.drawGraph();
    this.drawRulers();
    this.brushPreviewDrawn = false;
    this.playbackCursorDrawn = false;
}
audioBrush.WaveDisplay.prototype.recalculateAndRedraw = function() {
    this.calculateGraph();
    this.redraw();
}

audioBrush.WaveDisplay.prototype.zoom = function(sf, o) {
    if(sf == undefined) {
        s = 1.5;
    }
    if(this.pixelsPerSample >= 60 && sf > 1) {
        sf = 60/this.pixelsPerSample;
        return;
    }
    if(o == undefined) {
        o = this.tAtX(this.box.midX);
    }
    this.startT = (this.startT-o)/sf + o;
    this.endT = (this.endT-o)/sf + o;

    this.checkLimits();
}
audioBrush.WaveDisplay.prototype.transport = function(dT) {
    this.startT += dT;
    this.endT += dT;

    this.checkLimits();
}

audioBrush.WaveDisplay.prototype.checkLimits = function() {
    if(this.startT < 0) {
        this.endT -= this.startT;
        this.startT = 0;
    }
    if(this.endT > this.sample.durationInSamples) {
        this.endT = this.sample.durationInSamples;
    }
}
