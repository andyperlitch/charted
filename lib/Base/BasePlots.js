/**
 * Plots Collection
 * 
 * Holds the plot models, and contains logic
 * for calculating extrema and x-value
*/
var Backbone = require('backbone');
var Plot = require('./BasePlot');
var Plots = Backbone.Collection.extend({
    
    model: Plot,
    
    initialize: function(models, options) {
        
        // Set properties
        this.chart = options.chart;
        this.data = this.chart.get('data');
        
    }
    
});

exports = module.exports = Plots;