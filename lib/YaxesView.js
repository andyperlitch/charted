/**
 * Y-axes View
 * 
 * This view holds the y-axis or axes
*/

var _ = require('underscore');
var kt = require('knights-templar');
var bassview = require('bassview');
var YaxisView = require('./YaxisView');
var YaxesView = bassview.extend({
    
    initialize: function(options) {
        this.data = options.data;
        this.setupSubviews();
        this.listenTo(this.model, 'change:multi_y', this.setupSubviews);
    },
    
    setupSubviews: function() {
        this.trigger('clean_up');
        if (this.model.get('multi_y')) {
            
            // create an axis for every plot
            this.collection.each(function(plot) {
                
                this.subview(plot.get('key')+'-yaxis', new YaxisView({
                    model: plot
                }));
                
            }, this);
            
        } else {
            
            // create a single axis for all plots
            this.subview('yaxis', new YaxisView({
                collection: this.collection
            }));
        }
    },
    
    render: function() {
        if (this.model.get('multi_y')) return this.renderMulti();
        else return this.renderSingle();
        return this;
    },
    
    renderSingle: function() {
        // make base html
        this.$el.html('<div class="main-yaxis chart-yaxis"></div>');
        // assign single axis to element
        // debugger;
        this.assign('.main-yaxis','yaxis');
    },
    
    renderMulti: function() {
        // init html string for axes
        var markup = '';
        // create assign hash
        var assignees = {};
        // loop through plots
        this.collection.each(function(plot){
            // cache class name 
            var className = plot.get('key')+'-yaxis';
            // add to base html
            markup += '<div class="chart-yaxis '+className+'"></div>';
            // add to assign hash
            assignees['.'+className] = className;
            
        },this);
        // update html
        this.$el.html(markup);
        // assign axes to their elements
        this.assign(assignees);
    }
    
});
exports = module.exports = YaxesView;