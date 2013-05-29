/**
 * Line Chart View
 * 
 * Main backbone view that holds all elements and subviews of module
*/
var kt = require('knights-templar');
var _ = require('underscore');
var Viewport = require('./Viewport');
var YaxesView = require('./YaxesView');
var XaxisView = require('./XaxisView');
var BaseView = require('../Base/BaseChartView');
var ChartView = BaseView.extend({
    
    initialize: function() {

        // Initialize all subviews
        this.subview( 'viewport', new Viewport({ 
            model: this.model, 
            collection: this.model.get('data'), 
            plots: this.model.plots,
            rootView: this }
        ));
            
        if (this.model.get('render_y')) {
            this.subview( 'yaxes', new YaxesView({ 
                model: this.model,
                collection: this.model.plots,
                data: this.model.get('data')
            }));
        }

        if (this.model.get('render_x')) {
            this.subview( 'xaxis', new XaxisView({ 
                model: this.model,
                collection: this.model.plots,
                data: this.model.get('data')
            }));
        }
        
        // Listeners
        this.listenTo(this.model, 'trigger_render change:vp_height', this.render);
        this.listenTo(this.model, 'change:multi_y', this.toggleMultiY)
        this.listenTo(this.model.get('data'), 'add remove reset update', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    
    // Override of setElement because we want
    // a single inner table inside this.$el.
    // This is to solve a horizontal scrollbar
    // issue when data is being re-rendered.
    setElement: function(element, delegate) {
        // Call parent setElement
        BaseView.prototype.setElement.call(this, element, delegate);
        
        // Create inner table
        this.$inner = $('<table class="chart-inner"></table>');
        this.$el.html(this.$inner);
        return this;
    },
    
    render: function() {
        
        if (this.model.get('no_render')) {
            return this;
        }
        
        this.lockDimensions();
        
        // For other elements to do things before render process
        this.model.trigger('before_render');
        
        // Set up markup
        var json = this.model.toJSON();
        var markup = this.template(json);
        
        // Replace html
        this.$inner.html(markup);
        
        // Assign subviews
        this.assign('.chart-viewport','viewport');
        
        if (json.render_y) {
            this.assign('.chart-yaxes','yaxes');
        }
        
        if (json.render_x) {
            this.assign('.chart-xaxis','xaxis');
        }
        
        this.unlockDimensions();
        
        return this;
    },
    
    toggleMultiY: function() {
        this.lockDimensions();
        var yaxes = this.subview('yaxes');
        if (yaxes) yaxes.toggleMultiY();
    },
    
    lockDimensions: function() {
        // Lock height to prevent scrollbar craziness
        var new_height = this.$('.chart-xaxis').height() + this.model.get('vp_height');
        var new_width = this.$('.chart-yaxes').width() + this.model.get('vp_width');
        this.$el.css({ 'height':new_height+'px' });
        this.$inner.css({'width':new_width+'px'});
    },
    
    unlockDimensions: function() {
        this.$el.css({'height':'auto','width':'auto'});
        this.$inner.css({'width':'auto'});
    },
    
    resizeChartToCtnr: function() {
        this.subview('viewport').subview('resizer').autoSize();
    },
    
    template: kt.make(__dirname+'/ChartView.html','_'),
    
});
exports = module.exports = ChartView;