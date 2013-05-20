var assert = require('assert');
var util = require('../lib/util');

describe('the util module', function() {
    
    it('should not transform labels that dont need it', function() {
        var label = util.createAxisLabel(100, 1);
        assert.equal(label, 100);
    });
    
    it('should be able to create a readable label for each guide', function() {
        var label = util.createAxisLabel(12.34, 0.234);
        var label2 = util.createAxisLabel(12.34248, 0.0442);
        assert.equal(label, 12.34);
        assert.equal(label2, '12.342');
    });
    
    it('should not allow more than 5 digits+ellipsis', function() {
        var label = util.createAxisLabel(12.3482736, 0.000234);
        var label2 = util.createAxisLabel(398.087321, 0.00003);
        assert.equal(label, '12.…27');
        assert.equal(label2, '398.…1');
    });
    
    it('should format thousands with "K"', function() {
        var label = util.createAxisLabel(1000, 1000);
        assert.equal(label, '1K');
        var label = util.createAxisLabel(4300, 900);
        assert.equal(label, '4.3K');
    });
    
    it('should display millions and billions nicely, even when the interval is small', function() {
        var label = util.createAxisLabel(4526000, 0.01);
        assert.equal(label, '4.526M');
        var label = util.createAxisLabel(4526345345.2387, 0.01);
        assert.equal(label, '4.…239B');
    });
    
});