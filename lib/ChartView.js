/**
 * Chart View
 * 
 * Main backbone view that holds all elements and subviews of module
*/
var kt = require('knights-templar');
var _ = require('underscore');
var Viewport = require('./Viewport');
var YaxesView = require('./YaxesView');
var XaxisView = require('./XaxisView');
var bassview = require('bassview');
var ChartView = bassview.extend({
    
    className: 'charted-ctnr',
    
    initialize: function() {
        // Initialize all subviews
        this.subview( 'viewport', new Viewport({ 
            model: this.model, 
            collection: this.model.get('data'), 
            plots: this.model.plots,
            rootView: this }));
            
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
                collection: this.model.get('data')
            }));
        }
        
        // Listeners
        this.listenTo(this.model, 'change:vp_height change:multi_y', this.render);
    },
    
    template: kt.make(__dirname+'/ChartView.html','_'),
    
    render: function() {
        // Set up markup
        var json = this.model.toJSON();
        var markup = this.template(json);
        
        // Replace html
        this.$el.html(markup);
        
        // Assign subviews
        this.assign('.chart-viewport','viewport');
        
        if (json.render_y) {
            this.assign('.chart-yaxes','yaxes');
        }
        
        if (json.render_x) {
            this.assign('.chart-xaxis','xaxis');
        }
        
        // Set height and width
        this.$el.css({
            'height' : (json.vp_height+3) + 'px'
        });
        
        return this;
    }
    
});
exports = module.exports = ChartView;