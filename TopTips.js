audioBrush.TopTips = function() {
    this.tips = new Array();

    for(var i in arguments) {
        this.addTip(arguments[i]);
    }
}

audioBrush.TopTips.prototype.addTip = function(tip) {
    this.tips.push(tip);
}

audioBrush.TopTips.prototype.__defineGetter__("html", function() {
    if(this._div) {
        return this._div;
    } else {
        this._div = this.makeHtml();
        this.refreshHtml();
        return this._div;
    }
});

audioBrush.TopTips.prototype.makeHtml = function() {
    var div = document.createElement("DIV");
    div.className = "toptips";

    this.interval = setInterval(this.refreshHtml.bind(this), 6000);

    return div;
}

audioBrush.TopTips.prototype.refreshHtml = function() {
    if(this._div) {
        this._div.innerText = this.tips[Math.floor(Math.random() * this.tips.length)];
    }
}