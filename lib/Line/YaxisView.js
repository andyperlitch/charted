/**
 * Y-axis View
 * 
 * This view holds an individual 
*/

var _ = require('underscore');
var kt = require('knights-templar');
var bassview = require('bassview');
var util = require('./util');
var YaxisView = bassview.extend({
    
    className: 'chart-yaxis',
    
    initialize: function() {
        if (this.model) {
            this.chart = this.model.chart;
            this.listenTo(this.model, 'destroy', this.remove);
        } else {
            this.chart = this.collection.chart ;
        }
    },
    
    template: kt.make(__dirname+'/YaxisView.html','_'),
    
    render: function() {
        
        if (this.model) {
            this.renderIndividualPlot();
        }
        else if (this.collection) {
            this.renderAggregatePlot();
        }
        
        this.$('ul').css('height',this.chart.get('vp_height')+'px');
        return this;
    },
    
    renderAggregatePlot: function() {
        var json = {
            key: 'all',
            label: '',
            color: '#777',
            markers: this.calcMarkers(this.collection.toActualY.bind(this.collection))
        }
        var markup = this.template(json);
        this.$el.html(markup);
    },
    
    renderIndividualPlot: function() {
        var json = this.model.toJSON();
        json['markers'] = this.calcMarkers(this.model.toActualY.bind(this.model));
        var markup = this.template(json);
        this.$el.html(markup);
    },
    
    calcMarkers: function(toActualY) {
        var num_guides = this.chart.getNumYGuides();
        var guide_interval = this.chart.getYGuideInterval();
        var real_interval = this.getRealYInterval();
        
        var markers = [];
        
        for (var i = 0; i < num_guides; i++) {
            var pixel_y = i * guide_interval;
            var actual_y = toActualY(pixel_y);
            markers.push({
                label: util.createAxisLabel(actual_y, real_interval),
                actual: actual_y,
                mark_class: 'top',
                bottom: 'auto',
                top: pixel_y+'px'
            });
            
        };
        var zero_marker = markers[i-1];
        zero_marker['mark_class'] = 'bottom';
        zero_marker['bottom'] = '0';
        zero_marker['top'] = 'auto';
        return markers;
    },
    
    getRealYInterval: function() {
        if (this.model) {
            return this.model.get('upper') - this.model.get('lower');
        }
        else if (this.collection){
            return this.collection.y_extrema.max - this.collection.y_extrema.min;
        }
        throw new Error('getRealYInterval expects that either a plot model or plots collection is available.');
    }
    
});
exports = module.exports = YaxisView;