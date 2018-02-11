audioBrush.Bristle = function() {
    this.worker = new Worker("bristleWorker.js");
    this.worker.bristle = this;
    
    this.onfinish = function(bitmap) {
    }
}

audioBrush.Bristle.prototype.interpretGesture = function(gesture) {
    // process a vector described mouse gesture and return an intensity bitmap
    var worker = new Worker("bristleWorker.js");
    worker.owner = this;
    worker.onmessage = function(e) {
        if(this.owner.onfinish) {
            this.owner.onfinish(e.data);
        }
    }
    worker.postMessage({
        "gesture": gesture
    });
}