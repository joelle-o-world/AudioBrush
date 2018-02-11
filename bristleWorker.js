self.onmessage = function(e) {
    if(e.data.bristle != undefined) {
        bristle = e.data.bristle;
    }
    if(e.data.gesture != undefined) {
        interpretGesture(e.data.gesture);
    }
}

bristle = {
    "shape":[0.05, 0.1, 0.05],
    "offset": -1
};

function interpretGesture(gesture) {
    var bitMap = new Array();
    for(var segI in gesture) {
        var seg = gesture[segI];
        
        var dir = seg.dir;
        if(dir != 0) {
            for(var t=Math.round(seg.tA+dir/2); t != Math.round(seg.tB+dir/2); t += dir) {
                for(var u=0; u<bristle.shape.length; u++) {
                    bit = t-bristle.offset+u;
                    
                    if(bitMap[bit] == undefined) {
                        bitMap[bit] = 0;
                    }
                    
                    bitMap[bit] += bristle.shape[u];
                }
            }
        }
    }
    
    postMessage(bitMap);
}