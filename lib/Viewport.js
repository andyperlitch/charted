/**
 * Viewport
 * 
 * This view holds the actual chart
*/
var Raphael = require('raphael');
var _ = require('underscore');
var kt = require('knights-templar');
var bassview = require('bassview');
var Resizer = require('./ResizerView');
var util = require('./util');
var Viewport = bassview.extend({
    
    initialize: function(options) {
        
        this.plots = options.plots;
        
        this.subview('resizer', new Resizer({
            model: this.model,
            rootView: options.rootView
        }));
        
        this.listenTo(this.model, 'change:vp_width', this.render);
    },
    
    template: kt.make(__dirname+'/Viewport.html','_'),
    
    render: function() {
        
        var json = this.model.toJSON();
        var markup = this.template(json);
        this.$el.html(markup);
        this.paper = Raphael(this.$('.chart-svg')[0], json.vp_width, json.vp_height);
        this.assign('.chart-resizer', 'resizer');
        if (json.draw_guides) this.renderGuides(json);
        this.renderData(json);
        return this;
        
    },
    
    renderGuides: function(json) {
        json = json || this.model.toJSON();
        // Get number of guides
        var num = this.model.getNumYGuides();
        // Get interval space
        var space = this.model.getYGuideInterval(num);
        // Reduce by 2 so as not to count borders
        num -= 2;
        // Loop through and create lines
        for (var i = 1; i <= num; i++){
            var y = Math.round(space*i);
            var pathString = 'M0 '+y+'L'+json.vp_width+' '+y;
            var guide = this.paper.path(pathString);
            util.addClass(guide, 'gridline');
        };
    },
    
    renderData: function(json) {
        json = json || this.model.toJSON();
        
        // Check mode, render accordingly
        switch(json.mode) {
            default:
                this.renderLines();
                this.renderPoints();
            break;
        }
    },
    
    renderLines: function() {
        // Define a hash of all series
        var plots = {};
        // Store x-key
        var x_key = this.model.get('x_key');
        // Loop through the data
        this.collection.each(function(point){
            // Calculate the x value
            var x_value = this.plots.toPixelX(point.get(x_key));
            console.log(x_value);
            // For each plot, 
            this.plots.each(function(plot){
                // store key for this plot
                var key = plot.get('key');
                // get point for this plot
                var point = []
                // create a key with array if not already there
                if (!plots.hasOwnProperty(key)) {
                    plots[key] = {
                        color: plot.get('color'),
                        points: ['M']
                    }
                }
                // store color of this plot
                // move to first point
                // line to any other point
            }, this);
                
        }, this);
    },
    
    renderPoints: function() {
        
    }
    
});
exports = module.exports = Viewport;