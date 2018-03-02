audioBrush.OscTool = function() {
    audioBrush.GenericTool.call(this);

    this.fMin = 20;
    this.fMax = 22000/10;
    this.master = 0.9;
    this.waveform = "sine";
    this.tempered = false;
}
audioBrush.OscTool.prototype = Object.create(audioBrush.GenericTool.prototype);
audioBrush.OscTool.prototype.constructor = audioBrush.OscTool();

audioBrush.OscTool.prototype.processOneSample = function(t, channel, sample, meta, I) {
    var f = meta.f;

    var phase = f * t/sample.sampleRate + meta.phaseOffset;

    return this.waveFunction(phase) * this.master;
}

audioBrush.OscTool.prototype.__defineGetter__("fMin", function() {
    return 440 * Math.pow(2, this.pMin/12);
});
audioBrush.OscTool.prototype.__defineSetter__("fMin", function(f) {
    this.pMin = 12/Math.log(2) * Math.log(f/440);
});
audioBrush.OscTool.prototype.__defineGetter__("fMax", function() {
    return 440 * Math.pow(2, this.pMax/12);
});
audioBrush.OscTool.prototype.__defineSetter__("fMax", function(f) {
    this.pMax = 12/Math.log(2) * Math.log(f/440);
});

audioBrush.OscTool.prototype.fAtY = function(y) {
    var p = (1-y) * (this.pMax-this.pMin) + this.pMin;
    if(this.tempered) {
        p = Math.round(p);
    }
    return 440 * Math.pow(2, p/12);
}

audioBrush.OscTool.prototype.cursorInfo = function(x, y, disp) {
    var f = this.fAtY( y/disp.box.height );
    var hp = audioBrush.frequencyToHumanPitch(f);
    f = Math.round(f*10)/10;
    return f+"Hz ("+hp+")";
}

audioBrush.OscTool.prototype.preStroke = function(shape, sample, meta) {
    meta.f = this.fAtY(meta.yControl);


    if(this.lastWave != undefined && meta.f != this.lastWave.f) {
        var dT = (meta.tO - this.lastWave.tO)/sample.sampleRate;

        var keys = Object.keys(shape[0]);
        if(dT > 0) {
            var pivotT = parseInt(keys[keys.length-1]);
        } else {
            var pivotT = parseInt(keys[0]);
        }

        var pivotPhase = (pivotT-this.lastWave.tO)*this.lastWave.f + this.lastWave.phaseOffset;
        pivotPhase %= 1;
        if(pivotPhase < 0) {
            pivotPhase += 1;
        }


        meta.phaseOffset = pivotPhase + (meta.tO - pivotT) * meta.f;

        //console.log("instead, calculate phase from the sample closest to this.lastWave.tO ??");
    } else {
        meta.phaseOffset = 0;
    }


    this.lastWave = {
        "tO": meta.tO,
        "phaseOffset": meta.phaseOffset,
        "f": meta.f
    }
}

audioBrush.OscTool.prototype.__defineGetter__("waveform", function() {
    return this._waveform;
});
audioBrush.OscTool.prototype.__defineSetter__("waveform", function(wf) {
    this._waveform = wf;
    this.waveFunction = this.waveFunctions[wf];
});
audioBrush.OscTool.prototype.waveFunctions = new Object();
audioBrush.OscTool.prototype.waveFunctions.sine = function(phase) {
    return Math.sin(2*Math.PI * phase);
}
audioBrush.OscTool.prototype.waveFunctions.saw = function(phase) {
    return (phase%1)*2 - 1;
}
audioBrush.OscTool.prototype.waveFunctions.square = function(phase) {
    if(phase%1 < 0)
        phase = phase%1 + 1;
    return Math.round(phase%1)*2-1;
}
audioBrush.OscTool.prototype.waveFunctions.triangle = function(phase) {
    phase %= 1;
    if(phase >= 0 && phase < 0.25) {
        return phase*4;
    } else if(phase >= 0.25 && phase < 0.75) {
        return 1-(phase-0.25)*4;
    } else {
        return (phase-0.75)*4 - 1;
    }
}

audioBrush.OscTool.prototype.makeHtml = function() {
    var div = document.createElement("DIV");
    div.className = "osctool";

    div.header = document.createElement("h2");
    div.header.innerText = "Oscillator Tool";
    div.fmin = createFrequencyInput();
    div.fmax = createFrequencyInput();
    div.gain = createRangeInput(0, 1);
    div.tempered = document.createElement("input");
    div.tempered.setAttribute("type", "checkbox");

    div.waveform = document.createElement("select");
    for(var i in this.waveFunctions) {
        var option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        div.waveform.appendChild(option);
    }

    div.visualiser = document.createElement("canvas");
    div.visualiser.className = "visualiser";
    div.visualiser.width = 70;
    div.visualiser.height = 30;

    div.appendChild(div.header);
    div.appendChild(div.visualiser);
    div.appendChild(labelWrapInput(div.waveform, "Waveform", "waveform"));
    div.appendChild(labelWrapInput(div.fmin, "Minimum Frequency", "fmin"));
    div.appendChild(labelWrapInput(div.fmax, "Maximum Frequency", "fmin"));
    div.appendChild(labelWrapInput(div.gain, "Gain", "gain"));
    div.appendChild(labelWrapInput(div.tempered, "Use just intonation", "tempered"));
    // fmin
    // fmax
    // gain
    // waveform
    // temper

    return div;
}

audioBrush.OscTool.prototype.refreshHtml = function() {
    if(this._div != undefined) {
        this._div.fmin.value = this.fMin;
        this._div.fmax.value = this.fMax;
        this._div.gain.value = this.master;
        this._div.waveform.value = this.waveform;
        this._div.tempered.checked = this.tempered;

        this.refreshVisualiser();
    }
}
audioBrush.OscTool.prototype.refreshVisualiser = function() {
    if(this._div) {
        var vis = this._div.visualiser;
        var ctx = vis.getContext("2d");
        ctx.clearRect(0, 0, vis.width, vis.height);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.moveTo(0, vis.height/2);
        for(var x=0; x<vis.width; x++) {
            var t = x*4 + 0.123;
            var a = this.waveFunction(t/vis.width);
            var y = vis.height/2 + a*(vis.height/4);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}
audioBrush.OscTool.prototype.readHtml = function() {
    if(this._div != undefined) {
        this.fMin = parseFloat(this._div.fmin.value);
        this.fMax = parseFloat(this._div.fmax.value);
        this.master = parseFloat(this._div.gain.value);
        this.waveform = this._div.waveform.value;
        this.tempered = this._div.tempered.checked;

        this.refreshVisualiser();
    }
}
