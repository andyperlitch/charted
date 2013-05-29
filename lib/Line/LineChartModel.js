/**
 * Line Chart Model
 * 
 * Chart model for line graphs
*/

var _ = require('underscore'), Backbone = require('backbone');
var Plots = require('./LinePlots');
var Data = require('./LineData');
var x_formats = require('./x_formatters');
var BaseModel = require('../Base/BaseChartModel');
var ChartModel = BaseModel.extend({
    
    defaults: {
        
        // Inherited from base
        type: 'line',
        data: [],
        id: '',
        
        // Line-specific
        multi_y: false,
        vp_width: 500,
        vp_height: 300,
        min_spacing_y: 75,
        min_spacing_x: 225,
        x_key: "",
        x_formatter: "",
        x_formatter_fn: undefined,
        x_ascending: true, 
        draw_guides: true,
        dot_radius: 3,
        dot_hover_radius:7,
        resizer: true,
        render_x: true,
        render_y: true,
        render_points: true
    },
    
    initialize: function(attrs, options) {
        BaseModel.prototype.initialize.call(this, attrs, options);
        
        // Listen for changes to x_formatter
        this.on('change:x_formatter', function(model, formatter){
            this.setXFormatter(formatter);
        });
        
        // Check for predefined x formatters
        var x_formatter = this.get('x_formatter');
        if (x_formatter) {
            this.setXFormatter( x_formatter );
        }
    },
    
    setupData: function(attrs) {
        this.set('data', new Data(attrs.data, {chart: this}));
    },
    
    setupPlots: function() {
        this.plots = new Plots([], { chart: this });
    },
    
    x_formats: x_formats,
    
    setXFormatter: function(formatter) {
        if (typeof formatter !== 'function') {
            this.state('x_formatter', formatter);
            formatter = this.x_formats[formatter];
        }
        this.set('x_formatter_fn', formatter);
    },
    
    // Some sensible default validation
    validate: function(attrs) {
        
        if (attrs.vp_width < 100 || attrs.vp_width > 2000) return "Viewport must have a reasonable width";
        
        if (attrs.vp_height < 100 || attrs.vp_height > 2000) return "Viewport must have a reasonable width";
        
    },
    
    getNumYGuides: function() {
        return Math.max( 2, Math.floor(this.get('vp_height')/this.get('min_spacing_y')) );
    },
    
    getYGuideInterval: function(num) {
        num = num === undefined ? this.getNumYGuides() : num;
        return Math.round( (this.get('vp_height')*10) / (num - 1) )/10;
    },
    
    getNumXGuides: function() {
        return Math.max( 2, Math.floor(this.get('vp_width')/this.get('min_spacing_x')) );
    },
    
    getXGuideInterval: function(num) {
        num = num === undefined ? this.getNumXGuides() : num;
        return Math.round( this.get('vp_width')/(num-1) );
    }
});

exports = module.exports = ChartModel;