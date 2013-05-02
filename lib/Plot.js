/**
 * Plot Model
 * 
 * This object holds general info about a series being plotted.
*/
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
        
        upper: undefined
        // Thie higher extremum (maximum) of this plot's values
        
    },
    
    initialize: function() {
        this.chart = this.collection.chart;
        this.updateExtrema();
        this.listenTo(this.chart, 'before_render', this.updateExtrema );
    },
    
    updateExtrema: function() {
        // console.log("updating extrema in plot");
        var extrema = this.collection.calcExtrema(this.get('key'), 0.1);
        this.set({
            lower: extrema.min,
            upper: extrema.max
        });
    },
    
    toPixelY: function(actual_y) {
        var extrema = (this.collection.chart.get('multi_y')) 
            ? { min: this.get('lower'), max: this.get('upper') }
            : false
        ;
        
        return this.collection.toPixelY(actual_y, extrema);
    },
    
    toPixelX: function(actual_x) {
        return this.collection.toPixelX(actual_x);
    },
    
    toActualY: function(pixel_y) {
        var extrema = (this.collection.chart.get('multi_y')) 
            ? { min: this.get('lower'), max: this.get('upper') }
            : false
        ;
        return this.collection.toActualY(pixel_y, extrema);
    }
    
});
exports = module.exports = Plot;