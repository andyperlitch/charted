var _ = require('underscore'), Backbone = require('backbone');
var Chart = require('../../');
var dz = new Backbone.Collection([
   { key1: 2, key2: 45, key3: 311 },
   { key1: 8, key2: 12, key3: 204 },
   { key1: 4, key2: 34, key3: 193 },
   { key1: 1, key2: 93, key3: 101 },
   { key1: 3, key2: 77, key3: 489 }
]);
var chart = window.chart = new Chart({
    data: dz,
    vp_width: 1000,
    vp_height: 400,
    id: "simple"
});
$(function() {
    chart.model.plot({
        key: 'key1',
        color: 'green'
    });
    chart.model.plot({
        key: 'key2',
        color: 'blue'
    });
    $('#trg').html(chart.view.render().el);
});
