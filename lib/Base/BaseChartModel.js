/**
 * Base Chart Model
 * 
 * Holds all pertinent state information about the chart.
*/

var _ = require('underscore'), Backbone = require('backbone');
var Plots = require('./BasePlots');
var Data = require('./BaseData');
var ChartModel = Backbone.Model.extend({
    
    defaults: {
        // The chart type, eg. line, bar, pie, histo, candle
        type: 'line',
        
        // The array of models with which to create 
        // the data collection. See the initialize fn.
        data: [],
        
        // Used to store state
        id: ''
    },
    
    initialize: function(attrs, options) {
        
        // Set up data collection
        this.setupData(attrs);
        
        // Set up plot collection. In this case, "plots" 
        // is synonymous with "series" (plural).
        this.setupPlots();
        
        // Load previous state, if there is one
        this.loadStoredInfo();
        
    },
    
    // Override if necessary in derived classes
    setupData: function(attrs) {
        this.set('data', new Data(attrs.data, {chart: this}));
    },
    
    // Override if necessary in derived classes
    setupPlots: function() {
        this.plots = new Plots([], { chart: this });
    },
    
    serialize: function() {
        var json = this.toJSON();
        json['plots'] = this.plots.toJSON();
        json['data'] = json['data'].toJSON();
        return json;
    },
    
    // Add a plot/series to the chart.
    plot: function(attrs) {
        
        var plots = [].concat(attrs);
        
        for (var i = 0; i < plots.length; i++){
            var plot = plots[i];
            
            plot.label = plot.label || plot.key;

            this.plots.add(plot, {merge: true, chart: this} );
        };
        
    },
    
    // Removes plot from chart.
    unplot: function(key) {
        var model = this.plots.get(key);
        if (model) {
            this.plots.remove(model);
            model.destroy();
        }
    },
    
    // This function looks up any and all values that should be restored from previous sessions.
    loadStoredInfo: function() {
        
        // Check for specified id
        if (!this.get("id")) return;
        
        // Check for state
        var prevState = this.state();
        
        // Restore it
        this.set(prevState, { validate: true });
        
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
        } else if (key !== undefined) {
            return store[key];
        } else {
            return store;
        }
        
    },
    
    // Safely destroy this chart
    destroy: function() {
        // Ensure that no circular references will crop up
        this.trigger('destroy');
        this.plots = undefined;
        this.unset('data');
    }
});

exports = module.exports = ChartModel;