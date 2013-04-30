/**
 * Plots Collection
 * 
 * Holds the plot models, and contains logic
 * for calculating extrema and x-value
*/
var util = require('./util');
var _ = require('underscore');
var Backbone = require('backbone');
var Plot = require('./Plot');
var Plots = Backbone.Collection.extend({
    
    model: Plot,
    
    initialize: function(models, options) {
        
        // Set properties
        this.chart = options.chart;
        this.data = this.chart.get('data');
        this.y_extrema = { min: undefined, max: undefined };
        
        // Initial setup
        this.updateExtrema();
        
        // Listeners
        this.on('add remove reset', this.updateExtrema );
        this.listenTo(this.data, 'add remove reset update', this.updateExtrema );
        
    },
    
    updateExtrema: function() {
        
        // If we are rendering individual y-axis,
        // ignore this action
        if (!this.chart.get('multi_y')) {
            // Get all keys to take into consideration
            // when calculating overall extrema
            var keys = this.pluck('key');

            // Update this.y_extrema values.
            this.y_extrema = this.calcExtrema(keys, 0.1);
        }
        
        // Get the x-extrema
        this.x_extrema = this.calcExtrema(this.chart.get('x_key'), 0.05);
        
    },
    
    calcExtrema: function(keys, padding) {
        // Check for single key specification
        if (typeof keys === "string") keys = [keys];
        
        // Ensure padding is a number
        padding = padding ? +padding : 0 ;
        
        // Check if nothing there
        if (!this.data.length) return { min: undefined, max: undefined };

        // Calculate extrema from all keys' values.
        var extrema = this.data.reduce(function(memo, point, index) {
            
            for (var i = keys.length - 1; i >= 0; i--){
                
                var value = point.get(keys[i]);

                memo.min = memo.min === undefined ? value : Math.min(memo.min, value);

                memo.max = memo.max === undefined ? value : Math.max(memo.max, value);
                
            };
            
            return memo;
            
        }, {}, this);
        
        // Do we need to calculate padding?
        if (padding === 0) return extrema;
        
        // Padding is a percentage of range, so if
        var range = extrema.max - extrema.min;
        
        // ... then
        var paddingAmt = padding * range;
        
        // Make the padding adjustments.
        extrema.min -= paddingAmt;
        
        extrema.max += paddingAmt;

        return extrema;
    },
    
    toPixelX: function(actual_x) {
        var x_extrema = this.x_extrema;
        return Math.round(util.convertToRange(
            actual_x,
            x_extrema.min,
            x_extrema.max,
            this.chart.get('vp_width')
        ));
    }
    
});

exports = module.exports = Plots;