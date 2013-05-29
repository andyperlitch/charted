var ChartModel = require("./lib/ChartModel");
var ChartView = require("./lib/ChartView");

var Charted = function(options) {
    
    if (options.type === undefined) {
        throw new Error('When instantiating a chart, please specify the type');
    }
    
    this.model = new ChartModel[options.type](options);
    
    this.view = new ChartView[options.type]({
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