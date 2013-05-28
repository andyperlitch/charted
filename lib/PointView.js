var _ = require('underscore');
var bormat = require('bormat');
var kt = require('knights-templar');
var RaphaelView = require('./RaphaelView');
var PointView = RaphaelView.extend({
    
    info_template: kt.make(__dirname+'/PointToolTip.html', '_'),
    
    initialize: function(options) {
        this.coords = options.coords;
        this.plot = options.plot;
        this.parent = options.parent;
        this.chart = options.chart;
    },
    
    events: {
        'mouseover': 'onMouseOver',
        'mouseout': 'onMouseOut'
    },
    
    onMouseOver: function(evt){
        this.rEl.animate({"r":this.chart.get('dot_hover_radius')},300, "elastic");
        this.chart.set('no_render', true);
        var x_key = this.chart.get('x_key');
        var y_key = this.plot.get('key');
        var x_val = this.model.get(x_key);
        var y_val = this.model.get(y_key);
        var x_formatter = this.chart.get('x_formatter_fn');
        
        var json = {
            label: this.plot.get("label"),
            x_key: x_key,
            x_value: typeof x_formatter === "function" ? x_formatter(x_val) : x_val ,
            y_key: y_key,
            y_value: y_val,
            color: this.plot.get("color")
        };
        
        // Set position of box
        json.top = evt.clientY - this.parent.$el.offset().top + 10 + window.scrollY;
        if (json.top > this.chart.get('vp_height') - 75) json.top -= 100;
        json.top = Math.max(0, json.top);
        json.right = Math.max(0, Math.min(this.chart.get('vp_width') - (evt.clientX - this.parent.$el.offset().left) - 50 + window.scrollX, this.chart.get('vp_width') - 150));
        json.y_value = bormat.commaGroups(json.y_value);
        var markup = this.info_template(json);
        $(markup.trim()).appendTo(this.parent.$el);
    },
    
    onMouseOut: function(){
        this.rEl.animate({"r":this.chart.get('dot_radius')},300, "elastic");
        this.parent.$el.find('.chart-pointinfo').remove();
        this.chart.set('no_render', false);
    }
    
});
exports = module.exports = PointView;