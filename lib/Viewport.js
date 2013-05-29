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
var PointView = require('./PointView');
var util = require('./util');
var Viewport = bassview.extend({
    
    initialize: function(options) {
        
        this.plots = options.plots;
        this.parent = options.rootView;
        this.paper = false;
        this.subview('resizer', new Resizer({
            model: this.model,
            rootView: options.rootView
        }));
        this.listenTo(this.model, 'change:vp_width change:render_points', this.render);
    },
    
    template: kt.make(__dirname+'/Viewport.html','_'),
    
    render: function() {
        this.trigger('clean_up_paper');
        var json = this.model.toJSON();
        var markup = this.template(json);
        this.$el.html(markup);
        if ( this.paper ) this.paper.remove();
        this.paper = Raphael(this.$('.chart-svg')[0], json.vp_width, json.vp_height);
        this.assign('.chart-resizer', 'resizer');
        if (json.draw_guides) this.renderGuides(json);
        if (this.collection.length) this.renderData(json);
        else {
            this.paper.text(json.vp_width/2,10,'no data received');
        }
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
        // Ensure we have the serialized model
        json = json || this.model.toJSON();
        
        // Create a plot object
        var plot_object = this.generatePlotObjects();
        
        // Check mode, render accordingly
        this.renderLines(plot_object);
        if (this.model.get('render_points')) {
            this.renderPoints(plot_object);
        }
    },
    
    renderLines: function(plot_object) {
        if (this.collection.length < 2) return this;
        _.each(plot_object, function(plot, key) {
            
            var line = this.paper.path(plot.point_string);
            util.addClass(line, 'plotline').attr('stroke',plot.color);
            
        }, this);
        return this;
    },
    
    renderPoints: function(plot_object) {
        _.each(plot_object, function(plot, key) {
            
            _.each(plot.point_arrs, function(coords, i) {
                
                var elem = this.paper.circle(coords[0], coords[1], this.model.get('dot_radius'));
                util.addClass(elem,'plotpoint')
                    .removeData()
                    .attr('stroke',plot.color);
                
                var view = new PointView({
                    el: elem,
                    model: plot.orig_points[i],
                    coords: coords,
                    plot: plot.orig_plot,
                    parent: this,
                    chart: this.model
                });
                
                view.listenTo(this, 'clean_up_paper clean_up', view.remove);
                
                
            }, this);
            
        }, this);
        return this;
    },
    
    generatePlotObjects: function() {
        // Define a hash of all series
        var plot_memo = {};
        
        // Store x-key
        var x_key = this.model.get('x_key');
        
        // Get the visible plots
        var visible_plots = this.plots.filter(function(plot) { return plot.get('visible') });
        // Loop through the data
        this.collection.each(function(point){
            // Calculate the x value
            var x_value = this.plots.toPixelX(point.get(x_key));
            // For each visible plot, 
            _.each(visible_plots, function(plot){
                // store key for this plot
                var key = plot.get('key');
                var y_value = point.get(key);
                if (y_value === undefined) return;
                
                // get point for this plot ( [x,y].join(' ') )
                var point_arr = [x_value, plot.toPixelY(y_value)];
                var point_string = point_arr.join(' ');
                // create a key with array if not already there
                if (!plot_memo.hasOwnProperty(key)) {
                    plot_memo[key] = {
                        // store color of this plot
                        color: plot.get('color'),
                        // move to first point
                        point_arrs: [point_arr],
                        // store in point strings
                        point_string: ['M', point_string ],
                        // store link to original point backbone model
                        orig_points: [point],
                        // store original plot model
                        orig_plot: plot
                    }
                }
                else {
                    // line to any other point
                    var memo_obj = plot_memo[key];
                    memo_obj['point_string'].push('L',point_string);
                    memo_obj['point_arrs'].push(point_arr);
                    memo_obj['orig_points'].push(point);
                }
            }, this);
            
        }, this);
        // convert the array to path strings and create line elements
        _.each(plot_memo, function(plot_obj, key){
            plot_obj['point_string'] = plot_obj['point_string'].join('');
        });
        return plot_memo;
    },
    
});
exports = module.exports = Viewport;