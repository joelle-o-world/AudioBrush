audioBrush.formatSeconds = function(t) {
    if(Math.abs(t) < 10) {
        return Math.round(t*100000)/100 + "ms";
    } else {
        return Math.round(t*100)/100 + "s";
    }
}