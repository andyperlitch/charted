/**
 * Data collection
 * 
*/
var Backbone = require('backbone');
var Point = require('./BasePoint');
var Data = Backbone.Collection.extend({
    
    model: Point,
    
    initialize: function(models, options) {
        this.chart = options.chart;
    }
    
});
exports = module.exports = Data;