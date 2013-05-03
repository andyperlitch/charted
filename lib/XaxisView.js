/**
 * X-axis View
 * 
 * This view holds the x-axis
*/

var _ = require('underscore');
var kt = require('knights-templar');
var bassview = require('bassview');
var XaxisView = bassview.extend({
    
    initialize: function(options) {
       
       this.data = options.data;
       
       this.listenTo(this.model, 'change:vp_width', this.render);
       
    },
    
    render: function() {
        if (this.data.length == 0 || this.collection.length == 0) {
            this.$el.empty();
            return;
        }
        
        this.$el.empty().css('width', this.model.get('vp_width')+'px');
        
        // Get the extrema for the x axis
        var extrema = this.collection.x_extrema;
        if (extrema === false) {
            // TODO: render in a way to show that we are waiting for data.
            return;
        }
        
        // Create the axis
        var $axis = $('<ul></ul>');
        
        // Get the range
        var range = extrema.max - extrema.min;
        
        // Get number of markers to show
        var num_markers = this.model.getNumXGuides();
        var pixel_increments = Math.round(10*(this.model.get("vp_width") / (num_markers - 1) ))/10;
        var value_increments = range / num_markers;
        var x_formatter = this.model.get('x_axis_formatter');
        var use_formatter = "function" === typeof x_formatter;

        // Create labels for the axis
        for ( var i = 0; i < num_markers; i++ ) {
            var value = extrema.min + i*value_increments;
            var display_value = use_formatter ? x_formatter(value) : value ;
            
            var $marker = $('<li class="mark">'+display_value+'</li>')
            
            if (i === num_markers - 1) {
                $marker.css("right", "0px").addClass('right')
            } else {
                if (i === 0) {
                    $marker.addClass('bottom');
                }
                var newLeft = i * pixel_increments;
                $marker.css('left', newLeft+"px");
            }
            $marker.appendTo($axis)
        }
        
        // Set height and append to the element
        $axis.appendTo(this.$el);
        
        return this;
    }
    
});
exports = module.exports = XaxisView;