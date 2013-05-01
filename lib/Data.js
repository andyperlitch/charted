/**
 * Data collection
 * 
*/
var _ = require('underscore'), Backbone = require('backbone');
var Point = Backbone.Model.extend({
    
    idAttribute: '__id'
    
});
var Data = Backbone.Collection.extend({
    
    model: Point,
    
    initialize: function(models, options) {
        this.chart = options.chart;
    },
    
    comparator: function(point1, point2) {
        var ascending = this.chart.get('x_ascending');
        var key = this.chart.get('x_key');
        return point1.get(key) - point2.get(key);
    }
    
});
exports = module.exports = Data;