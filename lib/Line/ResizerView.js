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
        
        // Set up initial mouse position
        var initialX = evt.clientX;
        var initialY = evt.clientY;
        var initialWidth = this.model.get('vp_width');
        var initialHeight = this.model.get('vp_height');
        
        // Set up marquee object for resizing
        var vpOffset = this.rootView.$('.chart-viewport').offset();
        var $marq = $('<div class="charted-resize-marquee"></div>')
            .css({
                left: vpOffset.left,
                top: vpOffset.top
            })
            .appendTo($('body'));
        
        // Calculates new dimensions at current mouse position
        function getNewDims(evt) {
            evt.preventDefault();
            evt.originalEvent.preventDefault();
            var deltaX = evt.clientX - initialX;
            var deltaY = evt.clientY - initialY;
            var newWidth = +initialWidth + +deltaX;
            var newHeight = +initialHeight + +deltaY;
            return {
                width: newWidth,
                height: newHeight
            };
        }
        
        // When the mouse is released
        var release = function release(evt) {
            var dims = getNewDims(evt);
            this.setWidth(dims.width);
            this.setHeight(dims.height);
            $(window).off('mousemove', resize);
            $marq.remove();
            this.rootView.model.set('no_render', false);
        }.bind(this);
        
        function resize(evt) {
            var dims = getNewDims(evt);
            dims.width += 'px';
            dims.height += 'px';
            $marq.css(dims);
        }
        
        // Stop rendering
        this.rootView.model.set('no_render', true);
        
        // $(window).one('mouseup', release);
        // $(window).on('mousemove', resize);
        $(window).on('mousemove', resize);
        $(window).one('mouseup', release);
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