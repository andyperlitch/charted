/**
 * Plots Collection
 * 
 * Holds the plot models, and contains logic
 * for calculating extrema and x-value
*/
var util = require('./util');
var _ = require('underscore');
var Plot = require('./LinePlot');
var Base = require('../Base/BasePlots');
var Plots = Base.extend({
    
    model: Plot,
    
    initialize: function(models, options) {
        
        // Set properties
        Base.prototype.initialize.call(this, models, options);
        this.y_extrema = { min: undefined, max: undefined };
        
        // Initial setup
        this.updateExtrema();
        
        // Listeners
        this.listenTo(this.chart, 'before_render', this.updateExtrema );
        
    },
    
    updateExtrema: function() {
        // Get all keys to take into consideration
        // when calculating overall extrema
        // var keys = this.pluck('key');
        var plots_to_use = this.filter(function(plot) {
            return plot.get('visible');
        });
        
        var keys = _.map(plots_to_use, function(plot) {
            return plot.get('key');
        });

        // Update this.y_extrema values.
        if (!keys.length) {
            this.y_extrema = { min: 0, max: 1 };
            return;
        }
        this.y_extrema = this.calcExtrema(keys, 0.1);
        
        // Get the x-extrema, pad if necessary
        var paddingRight = this.data.length > 3 ? 0 : 1 - this.data.length/4 ;
        this.x_extrema = this.calcExtrema(this.chart.get('x_key'), 0, paddingRight);
        
    },
    
    calcExtrema: function(keys, paddingLeft, paddingRight) {
        // debugger;
        // Check for single key specification
        if (typeof keys === "string") keys = [keys];
        
        // Ensure padding is a number
        paddingLeft = paddingLeft ? +paddingLeft : 0 ;
        
        // Check for paddingRight specified
        paddingRight = paddingRight ? +paddingRight : paddingLeft ;
        
        // Check if nothing there
        if (!this.data.length) return { min: undefined, max: undefined };
        
        // Calculate extrema from all keys' values.
        var extrema = this.data.reduce(function(memo, point, index) {
            
            for (var i = keys.length - 1; i >= 0; i--){
                
                var value = point.get(keys[i]);
                
                if (value === undefined) continue;

                memo.min = memo.min === undefined ? value : Math.min(memo.min, value);

                memo.max = memo.max === undefined ? value : Math.max(memo.max, value);
                
            };
            
            return memo;
            
        }, {}, this);
        
        // Do we need to calculate padding?
        if (paddingLeft === 0 && paddingRight === 0) return extrema;
        
        // Padding is a percentage of range, so if
        var range = extrema.max - extrema.min;
        
        // ... then
        var paddingAmtLeft = Math.max(paddingLeft * range, 0.01);
        var paddingAmtRight = Math.max(paddingRight * range, 0.01);
        
        // Make the padding adjustments.
        extrema.min -= paddingAmtLeft;
        
        extrema.max += paddingAmtRight;

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
    },
    
    toPixelY: function(actual_y, extrema) {
        extrema = extrema || this.y_extrema
        var min = extrema.min;
        var max = extrema.max;
        var vp_height = this.chart.get('vp_height');
        var inverted = util.convertToRange(
            actual_y, 
            min, 
            max, 
            vp_height
        );
        return Math.round(vp_height - inverted);
    },
    
    toActualY: function(pixel_y, extrema) {
        extrema = extrema || this.y_extrema
        var vp_height = this.chart.get('vp_height');
        var reverted = vp_height - pixel_y;
        var actualRange = extrema.max - extrema.min;
        var actual = ((actualRange)*reverted)/vp_height;
        actual += extrema.min;
        return actual;
    }
    
});

exports = module.exports = Plots;