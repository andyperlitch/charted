var Backbone = require('backbone');
var Resizer = Backbone.View.extend({
    
    initialize: function(options) {
        this.rootView = options.rootView;
    },
    
    events: {
        'mousedown': 'grabResizer',
        'dblclick': 'autoSize'
    },
    
    render: function() {
        return this;
    },
    
    grabResizer: function(evt) {
        if ( evt.button === 2 ) return;
        evt.preventDefault();
        evt.originalEvent.preventDefault();
        
        var initialX = evt.clientX;
        var initialY = evt.clientY;
        var initialWidth = this.model.get('vp_width');
        var initialHeight = this.model.get('vp_height');
        
        var resize = function(evt) {
            evt.preventDefault();
            evt.originalEvent.preventDefault();
            var deltaX = evt.clientX - initialX;
            var deltaY = evt.clientY - initialY;
            var newWidth = +initialWidth + +deltaX;
            var newHeight = +initialHeight + +deltaY;
            this.setWidth(newWidth);
            this.setHeight(newHeight);
        }.bind(this);
        
        var release = function(evt) {
            $(window).off('mousemove', resize);
        }
        
        $(window).one('mouseup', release);
        $(window).on('mousemove', resize);
    },
    
    autoSize: function() {
        var newWidth = this.rootView.$el.width() - this.rootView.$('.chart-yaxes').width() - 10;
        this.setWidth(newWidth);
    },
    
    setWidth: function(newWidth) {
        // ensure that rendering is on
        this.model.set('no_render', false);
        this.model.set({'vp_width':newWidth}, {validate: true});
        this.model.state('vp_width', this.model.get('vp_width'));
    },
    
    setHeight: function(newHeight) {
        // ensure that rendering is on
        this.model.set('no_render', false);
        this.model.set({'vp_height': newHeight}, {validate: true});
        this.model.state('vp_height', this.model.get('vp_height'));
    }
    
});

exports = module.exports = Resizer