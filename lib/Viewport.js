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
        // Ensure we have the serialized model
        json = json || this.model.toJSON();
        
        // Create a plot object
        var plot_object = this.generatePlotObjects();
        
        // Check mode, render accordingly
        switch(json.mode) {
            default:
                this.renderLines(plot_object)
                    .renderPoints(plot_object);
            break;
        }
    },
    
    renderLines: function(plot_object) {
        _.each(plot_object, function(plot, key) {
            
            var line = this.paper.path(plot.point_string);
            util.addClass(line, 'plotline').attr('stroke',plot.color);
            
        }, this);
        return this;
    },
    
    renderPoints: function(plot_object) {
        _.each(plot_object, function(plot, key) {
            
            _.each(plot.point_arrs, function(coords) {
                
                var elem = this.paper.circle(coords[0], coords[1], this.model.get('dot_radius'));
                util.addClass(elem,'plotpoint')
                    .removeData()
                    .attr('stroke',plot.color);
                
                // this.delegatePointEvents(elem, coords, plot);
                
            }, this);
            
        }, this);
        return this;
    },
    
    // delegatePointEvents: function(elem, coords, pointmodel, plot) {
    //     var $popup = [];
    //     elem
    //         .mouseover(function(evt){
    //             this.model.unscheduleFunction("point_mouseout");
    //             elem.animate({"r":10},300, "elastic");
    //             this.model.set('no_render', true);
    //             var template = this.pointInfoTpl;
    //             var x_formatter = this.model.get('x_axis_formatter');
    //             var json = {
    //                 label: plot.get("label"),
    //                 x_key: x_axis_key,
    //                 x_value: typeof x_formatter === "function" ? x_formatter(model.get(x_axis_key)) : model.get(x_axis_key) ,
    //                 y_key: y_axis_key,
    //                 y_value: model.get(y_axis_key),
    //                 top: evt.clientY - this.$el.offset().top + 10 + window.scrollY,
    //                 right: this.model.get('viewport_width') - (evt.clientX - this.$el.offset().left) - 50 + + window.scrollX,
    //                 color: plot.get("color")
    //             }
    //             var markup = template(json);
    //             $popup = $(markup.trim()).appendTo(this.$el);
    //         }.bind(this))
    //         .mouseout(function(){
    //             if ($popup.length) $popup.empty().remove();
    //             point.animate({"r":5},300, "elastic");
    //             
    //             this.model.scheduleFunction("point_mouseout",function(){
    //                 this.model.set('no_render', false);
    //                 this.model.view.render();
    //             }.bind(this), 1000);
    //             
    //         }.bind(this))
    //     ;
    //     
    // },
    
    generatePlotObjects: function() {
        // Define a hash of all series
        var plot_memo = {};
        // Store x-key
        var x_key = this.model.get('x_key');
        // Loop through the data
        this.collection.each(function(point){
            // Calculate the x value
            var x_value = this.plots.toPixelX(point.get(x_key));
            // For each plot, 
            this.plots.each(function(plot){
                // store key for this plot
                var key = plot.get('key');
                // get point for this plot ( [x,y].join(' ') )
                var point_arr = [x_value, plot.toPixelY(point.get(key))];
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
                        orig_points: [point]
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