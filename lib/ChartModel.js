/**
 * Chart Model
 * 
 * Holds all pertinent state information about the chart.
*/

var _ = require('underscore'), Backbone = require('backbone');
var Plots = require('./Plots');
var Data = require('./Data');
var ChartModel = Backbone.Model.extend({
    
    defaults: {
        
        multi_y: false,
        mode: "line",
        vp_width: 500,
        vp_height: 300,
        min_spacing_y: 75,
        min_spacing_x: 225,
        data: [],
        render_x: true,
        render_y: true,
        x_key: "",
        x_ascending: true, 
        draw_guides: true,
        dot_radius: 3,
        dot_hover_radius:7
        
    },
    
    initialize: function(attrs, options) {
        
        // Check for predefined x formatters
        if (typeof attrs.x_axis_formatter === "string") {
            var x_formats = require('./x_formatters');
            if (x_formats[attrs.x_axis_formatter]) this.set('x_axis_formatter',x_formats[attrs.x_axis_formatter]);
        }
        
        this.set('data',new Data(attrs.data, {chart: this}));
        this.loadStoredInfo();
        this.plots = new Plots([], { chart: this });
        
    },
    
    // Some sensible default validation
    validate: function(attrs) {
        
        if (attrs.vp_width < 100 || attrs.vp_width > 2000) return "Viewport must have a reasonable width";
        
        if (attrs.vp_height < 100 || attrs.vp_height > 2000) return "Viewport must have a reasonable width";
        
    },
    
    serialize: function() {
        var json = this.toJSON();
        json['plots'] = this.plots.toJSON();
        return json;
    },
    
    // Tells the chart to plot the key on the data objects.
    // The lowerY and upperY params can either be the string
    // "auto" or numeric values. 
    // The max detail option can be set to override the chart detail value
    // for this specific key. If only two arguments are present,
    // the second is assummed to be this.
    plot: function(attrs) {
        
        var plots = [].concat(attrs);
        
        for (var i = plots.length - 1; i >= 0; i--){
            var plot = plots[i];
            
            plot.label = plot.label || plot.key;

            this.plots.add(plot, {merge: true, chart: this} );
        };
        
    },
    
    // Removes plot key from the plots hash.
    unplot: function(key) {
        var model = this.plots.get(key);
        if (model) {
            this.plots.remove(model);
            model.destroy();
        }
    },
    
    // This function looks up any and all values that should be restored from previous sessions.
    loadStoredInfo: function() {
        
        var chart_id = this.get("id");
        if (!chart_id) return;
        
        // Check for viewport width and height
        var prevWidth = this.state('vp_width');
        var prevHeight = this.state('vp_height');
        
        if (prevWidth) this.set('vp_width', prevWidth);
        if (prevHeight) this.set('vp_height', prevHeight);
        
    },
    
    // Set or get an attribute in localStorage
    state: function(key, value) {
        
        var storage_key = 'charted.'+this.get("id");
        var store = this.store || localStorage.getItem(storage_key) || {};
        
        if (typeof store !== "object") {
            try {
                store = JSON.parse(store);
            } catch(e) {
                store = {};
            }
        }
        this.store = store;
        
        if (value !== undefined) {
            store[key] = value;
            localStorage.setItem(storage_key, JSON.stringify(store));
            return this;
        } else {
            return store[key];
        }
        
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
    },
    
    scheduleFunction: function(key, fn, delay) {
        this.__schedule__ = this.__schedule__ || {};
        if (this.__schedule__[key] !== undefined) clearTimeout(this.__schedule__[key]);
        this.__schedule__[key] = setTimeout(fn,delay);
    },
    
    unscheduleFunction: function(key) {
        if (this.__schedule__ === undefined) return;
        clearTimeout(this.__schedule__[key]);
        delete this.__schedule__[key];
    },
    
    destroy: function() {
        // Ensure that no circular references will crop up
        this.trigger('destroy');
        this.plots = undefined;
        this.unset('data');
    }
});

exports = module.exports = ChartModel;