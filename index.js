var ChartModel = require("./lib/ChartModel");
var ChartView = require("./lib/ChartView");

var Charted = function(options) {
    
    this.model = new ChartModel[options.mode](options);
    
    this.view = new ChartView[options.mode]({
        model: this.model
    });
    
    this.data = this.model.get('data');
};

Charted.prototype.plot = function(attrs) {
    this.model.plot(attrs);
    return this;
}

Charted.prototype.render = function() {
    this.view.render();
    return this.view;
}

Charted.prototype.destroy = function() {
    this.model.destroy();
}

exports = module.exports = Charted