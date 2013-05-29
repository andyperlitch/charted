/**
 * Line Data collection
 * 
*/
var Base = require('../Base/BaseData');
var Data = Base.extend({
    
    comparator: function(point1, point2) {
        var ascending = this.chart.get('x_ascending');
        var key = this.chart.get('x_key');
        return point1.get(key) - point2.get(key);
    }
    
});
exports = module.exports = Data;