/**
 * Plot Model
 * 
 * This object holds general info about a series being plotted.
*/
var util = require('./util');
var Backbone = require('backbone');
var Plot = Backbone.Model.extend({
    
    defaults: {
        
        key: "",
        // This is the attribute in the data 
        // points that constitutes the y-value.
        
        color: "",
        // The color of the plotted elements in
        // this series.
        
        lower: undefined,
        // The lower extremum (minimum) of this plot's values
        
        higher: undefined
        // Thie higher extremum (maximum) of this plot's values
        
    },
    
    initialize: function() {
        this.chart = this.collection.chart;
        this.updateExtrema();
        this.listenTo(this.collection.data, "add remove", this.updateExtrema );
    },
    
    updateExtrema: function() {
        var extrema = this.collection.calcExtrema(this.get('key'), 0.1);
        this.set({
            lower: extrema.min,
            upper: extrema.max
        });
    },
    
    toPixelY: function(actual_y) {
        var min, max;
        if (this.collection.chart.get('multi_y')) {
            min = this.get('lower');
            max = this.get('upper');
        }
        else {
            var gy_extrema = this.collection.y_extrema;
            min = gy_extrema.min;
            max = gy_extrema.max;
        }
        
        var vp_height = this.chart.get('vp_height');
        var inverted = util.convertToRange(
            actual_y, 
            min, 
            max, 
            vp_height
        );
        return Math.round(vp_height - inverted);
    },
    
    toPixelX: function(actual_x) {
        return this.collection.toPixelX(actual_x);
    }
    
});
exports = module.exports = Plot;