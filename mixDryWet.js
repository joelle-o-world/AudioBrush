audioBrush.mixDryWet = function(ratio, dry, wet) {
    if(ratio == undefined) {
        ratio = 1/2;
    }
    return dry*(1-ratio) + wet*ratio;
}