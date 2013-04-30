var _ = require('underscore');
var kt = require('knights-templar');
var RaphaelView = require('./RaphaelView');
var PointView = RaphaelView.extend({
    
    info_template: kt.make(__dirname+'/PointToolTip.html', '_'),
    
    initialize: function(options) {
        this.coords = options.coords;
        this.plot = options.plot;
        this.parent = options.parent;
    },
    
    events: {
        'mouseover': 'onMouseOver',
        'mouseout': 'onMouseOut'
    },
    
    onMouseOver: function(evt){
        this.model.unscheduleFunction("point_mouseout"+this.cid);
        this.rEl.animate({"r":this.model.get('dot_hover_radius')},300, "elastic");
        this.model.set('no_render', true);
        var x_key = this.model.get('x_key');
        var x_formatter = this.model.get('x_axis_formatter');
        var json = {
            label: this.plot.get("label"),
            x_key: x_key,
            x_value: typeof x_formatter === "function" ? x_formatter(this.coords[0]) : this.coords[0] ,
            y_key: this.plot.get('key'),
            y_value: this.coords[1],
            top: evt.clientY - this.parent.$el.offset().top + 10 + window.scrollY,
            right: this.model.get('vp_width') - (evt.clientX - this.parent.$el.offset().left) - 50 + + window.scrollX,
            color: this.plot.get("color")
        }
        var markup = this.info_template(json);
        $(markup.trim()).appendTo(this.parent.$el);
    },
    
    onMouseOut: function(){
        this.rEl.animate({"r":this.model.get('dot_radius')},300, "elastic");
        this.parent.$el.find('.chart-pointinfo').remove();
        this.model.scheduleFunction("point_mouseout"+this.cid,function(){
            this.model.set('no_render', false);
        }.bind(this), 1000);
        
    }
    
});
exports = module.exports = PointView;