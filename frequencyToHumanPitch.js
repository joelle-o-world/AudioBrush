audioBrush.frequencyToHumanPitch = function(f) {
    var p = Math.round(12/Math.log(2) * Math.log(f/440) + 69);
    
    var pc = p%12;
    var octave = Math.floor(p/12);
    
    var pName = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][pc];
    return pName + octave;
}