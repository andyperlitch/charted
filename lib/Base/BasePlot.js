/**
 * Base Plot Model
 * 
 * This object holds general info about a series being plotted.
*/
var Backbone = require('backbone');
var Plot = Backbone.Model.extend({
    
    defaults: {

        // This is the attribute in the data 
        // points that constitutes the y-value.
        key: '',
        
        // The color of the plotted elements in
        // this series.
        color: '',
        
        // The visibility of this plot
        visible: true
        
    },
    
    idAttribute: 'key',
    
    destroy: function() {
        this.trigger('destroy');
        this.stopListening();
    }
    
});
exports = module.exports = Plot;