window.onload = function() {

    audioBrush.tips = new audioBrush.TopTips(
        "Scroll up/down to zoom in and out",
        "Scroll left/right to move arround the sample",
        "Select tools from the toolbar on the left"
    );
    document.getElementById("tipsWrapper").appendChild(audioBrush.tips.html);

    audioBrush.cursorInfoDiv = document.getElementById("cursorInfo");
    audioBrush.cursorInfoDiv.style.display = "none";
    audioBrush.toolInspectorDiv = document.getElementById("toolInspector");
    audioBrush.brushInspectorWrapper = document.getElementById("brushInspectorWrapper");
    audioBrush.sampleDisplayDiv = document.getElementById("mainSample");

    disp = new audioBrush.WaveDisplay();
    disp.sample = new audioBrush.Sample(44100);
    //disp.sample.loadFromFile("exampleSample.wav");

    disp.adoptCanvas( audioBrush.sampleDisplayDiv );
    disp.recalculateAndRedraw();

    /*audioBrush.selectTool( new audioBrush.OscTool() );
    audioBrush.selectBrush( new audioBrush.Brush() );
    audioBrush.selectedBrush.xL = -50;
    audioBrush.selectedBrush.xR = 50;*/
    chooseTool2();

    var mouseListenF = function(e) {
        var rect = this.getBoundingClientRect();
        var mouseX = e.clientX-rect.left;
        var mouseY = e.clientY-rect.top;
        if(e.buttons == 1) {
            var shape = audioBrush.selectedBrush.makeShape(mouseX, mouseY, disp);
            audioBrush.selectedTool.stroke(shape, disp.sample, {
                "yControl": disp.box.relY(mouseY),
                "brush": audioBrush.selectedBrush,
                "tO": disp.tAtX(mouseX)
            });
            disp.recalculateAndRedraw();

            if(audioBrush.selectedBrush != undefined) {
                audioBrush.selectedBrush.drawPreview(mouseX, mouseY, disp);
            }
        }
    };
    disp.canvas.addEventListener("mousemove", mouseListenF, false);

    disp.canvas.addEventListener("mousedown", mouseListenF, false);



    // -- cursorInfo --
    disp.canvas.addEventListener("mousemove", function(e) {
        if(audioBrush.selectedTool.cursorInfo) {
            var rect = this.getBoundingClientRect();
            var mouseX = e.clientX-rect.left;
            var mouseY = e.clientY-rect.top;
            audioBrush.cursorInfoDiv.innerText = audioBrush.selectedTool.cursorInfo(mouseX, mouseY, disp);
            audioBrush.cursorInfoDiv.style.display = "block";
        } else {
            audioBrush.cursorInfoDiv.style.display = "none";
        }
    });
    disp.canvas.addEventListener("mouseout", function(e) {
        audioBrush.cursorInfoDiv.style.display = "none";
        disp.recalculateAndRedraw();
    });

    document.addEventListener("mousemove", function(e) {
        audioBrush.cursorInfoDiv.style.left = e.clientX + 25;
        audioBrush.cursorInfoDiv.style.top = e.clientY + 25;
    }, false);
}


audioBrush.selectBrush = function(brush) {
    this.selectedBrush = brush;
    this.brushInspectorWrapper.innerHTML = "";
    this.brushInspectorWrapper.appendChild(brush.html);
}
audioBrush.selectTool = function(tool) {
    this.selectedTool = tool;
    this.toolInspectorDiv.innerHTML = "";
    this.toolInspectorDiv.append(tool.html);
}
