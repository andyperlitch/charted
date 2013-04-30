var _ = require('underscore'), Backbone = require('backbone');
var Raphael = require('raphael');
var delegateEventSplitter = /^(\S+)$/;
var RaphaelView = Backbone.View.extend({

    _ensureElement: function() {
        if (!this.el) {
            throw 'RaphaelView must be provided with a Raphael element';
        } else {
            this.setElement(_.result(this, 'el'), false);
        }
    },
    
    setElement: function(element, delegate) {
        if (this.$el) this.undelegateEvents();
        this.rEl = element;
        this.$el = Backbone.$(element.node);
        this.el = element.node;
        if (delegate !== false) this.delegateEvents();
        return this;
    },
    
    remove: function() {
        this.rEl.remove();
        Backbone.View.prototype.remove.call(this);
    }

});
exports = module.exports = RaphaelView;