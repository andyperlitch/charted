var assert = require('assert');
var _ = require('underscore'), Backbone = require('backbone');
describe("the Charted module", function() {
    
    describe("a simple chart", function() {
        
        beforeEach(function() {
            this.Charted = require('../');
            var now = +new Date();
            var dz = [
               { key2: 45, key3: 311, time: now },
               { key1: 4, key3: 193, time: now + 60000 },
               { key1: 1, key2: 93, time: now + 105000 },
               { key1: 8, key2: 12, key3: 204, time: now + 120000 },
               { key1: 3, key2: 77, key3: 489, time: now - 50000 }
            ];

            this.chart = new this.Charted({
                data: dz,
                id: 'simple',
                x_key: 'time',
                x_formatter: 'time',
                multi_y: false
            });
            this.$pg = $("#playground");
            this.chart.render().$el.appendTo(this.$pg);
        });
        
        it("should contain a view and a model", function() {
            assert(this.chart.view instanceof Backbone.View, "view is not an instance of bb view");
            assert(this.chart.model instanceof Backbone.Model, "view is not an instance of bb view");
        });
        
        it("should create a collection from the data given", function() {
            var data = this.chart.model.get('data');
            assert(data instanceof Backbone.Collection, "did not create bc from data");
        });
        
        it("should not try to render axes if there are no plots", function() {
            assert.equal(this.$pg.find('.chart-yaxis').length, 0, 'it rendered y-axes when it should not have');
            assert.equal(this.$pg.find('.chart-xaxis ul').length, 0, 'it rendered x-axes when it should not have');
        });
        
        it("")
        
        afterEach(function() {
            this.chart.destroy();
        });
        
    });
})