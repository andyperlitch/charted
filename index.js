var ChartModel = require("./lib/ChartModel");
var ChartView = require("./lib/ChartView");

var Charted = function(options) {
    
    this.model = new ChartModel(options);
    
    this.view = new ChartView({
        model: this.model
    });
    
};

Charted.prototype.plot = function(attrs) {
    this.model.plot(attrs);
    return this;
}

exports = module.exports = Charted