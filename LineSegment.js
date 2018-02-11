audioBrush.LineSegment = function() {
    this.tA;
    this.tB;
    this.relYA;
    this.relYB;
    this.xA;
    this.xB;
    this.yA;
    this.yB;
    this.stampA;
    this.stampB;
}

audioBrush.LineSegment.prototype.calculate = function() {
    // calculates more useful information, deleting less useful information once its finished with
    this.recordTime = this.stampB-this.stampA;
    delete this.stampA;
    delete this.stampB;
    
    this.dir = Math.sign(this.tB-this.tA);
    
    this.movementX = this.xB-this.xA;
    this.movementY = this.yB-this.yA;
    delete this.xA, this.xB, this.yA, this.yB;
    
    this.mouseMovement = Math.sqrt(Math.pow(this.movementX, 2) + Math.pow(this.movementY, 2));
}