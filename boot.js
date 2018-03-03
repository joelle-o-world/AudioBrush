if(document.domain == "localhost") {
    AUDIOBRUSH_LOCATION = "http://localhost/audioBrush/";
} else if(document.domain == "www.joelplow.co.uk") {
    AUDIOBRUSH_LOCATION = "http://www.joelplow.co.uk/AudioBrush/";
} else if(document.domain == "joelplow.co.uk") {
    AUDIOBRUSH_LOCATION = "http://joelplow.co.uk/AudioBrush/";
}

function loadScript(file, defer) {
	var tag = document.createElement("script");
	tag.src = AUDIOBRUSH_LOCATION+file;
    tag.async = false;
    if(defer) {
        tag.defer = true;
    }
	document.head.appendChild(tag);
}

function loadStylesheet(file) {
	var tag = document.createElement("link");
    tag.setAttribute("rel", "stylesheet");
    tag.setAttribute("type", "text/css");
    tag.setAttribute("href", file);
	document.head.appendChild(tag);
}


audioBrush = {};

loadScript("interface.js");
loadScript("Sample.js");
loadScript("WaveDisplay.js");
loadScript("BoundingBox.js");
loadScript("formatSeconds.js");
loadScript("frequencyToHumanPitch.js");
loadScript("mixDryWet.js");
loadScript("LineSegment.js");
loadScript("Bristle.js");
loadScript("GenericTool.js");
loadScript("WaveShaper.js");
loadScript("OscTool.js");
loadScript("BitCrusher.js");
loadScript("FilterTool.js");
loadScript("DelayTool.js");
loadScript("CompressorTool.js");
loadScript("GainTool.js");
loadScript("Brush.js");
loadScript("TopTips.js");
loadScript("loadUserSample.js");
loadScript("audiobuffer-to-wav/index.js");
loadScript("exportSample.js");

loadScript("playback.js");

loadScript("DOMShortcuts.js");

loadStylesheet("interface.css");
loadStylesheet("toolInspector.css");
//loadStylesheet("WaveShaper.css");
//loadStylesheet("osctool.css");
//loadStylesheet("bitcrusher.css");
loadStylesheet("TopTips.css");
