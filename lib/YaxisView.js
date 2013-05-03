/**
 * Y-axis View
 * 
 * This view holds an individual 
*/

var _ = require('underscore');
var kt = require('knights-templar');
var bassview = require('bassview');
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
        
        var markers = [];
        
        for (var i = 0; i < num_guides; i++) {
            var pixel_y = i * guide_interval;
            markers.push({
                label: this.createAxisLabel(toActualY(pixel_y)),
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
    
    createAxisLabel: function(number) {
        if (number < 1) return Math.round(number*10)/10;
        else if (number > 1000000000) return (Math.round(number/10000000)/100)+'B';
        else if (number > 1000000) return (Math.round(number/10000)/100)+'M';
        else if (number > 1000) return (Math.round(number/100)/10)+'K';
        return Math.round(number);
    }
    
});
exports = module.exports = YaxisView;