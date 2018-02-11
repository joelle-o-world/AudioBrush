audioBrush.BoundingBox = function(left, right, top, bottom) {
    if(left != undefined && left.constructor == Number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    } else if(left != undefined && left.constructor == BoundingBox) {
        var model = l;
        this.left = model.left;
        this.right = model.right;
        this.top = model.top;
        this.bottom = model.bottom;
    }
}

audioBrush.BoundingBox.prototype.__defineGetter__("width", function() {
    return this.right-this.left;
});
audioBrush.BoundingBox.prototype.__defineGetter__("height", function() {
    return this.bottom-this.top;
});

audioBrush.BoundingBox.prototype.__defineGetter__("midX", function() {
    return (this.left + this.right)/2;
});
audioBrush.BoundingBox.prototype.__defineGetter__("midY", function() {
    return (this.bottom + this.top)/2;
});

audioBrush.BoundingBox.prototype.relX = function(x) {
    return (x-this.left)/this.width;
}
audioBrush.BoundingBox.prototype.relY = function(y) {
    return (y-this.top)/this.height;
}

audioBrush.BoundingBox.prototype.containsPoint = function(x, y) {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
}