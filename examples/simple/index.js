var _ = require('underscore'), Backbone = require('backbone');
var Chart = require('../../');
var dz = [
   { key1: 2, key2: 45, key3: 311, time: 1367296690307 },
   { key1: 4, key2: 34, key3: 193, time: 1367296692807 },
   { key1: 1, key2: 93, key3: 101, time: 1367296693807 },
   { key1: 8, key2: 12, key3: 204, time: 1367296691807 },
   { key1: 3, key2: 77, key3: 489, time: 1367296694807 }
];
var chart = window.chart = new Chart({
    data: dz,
    vp_width: 1000,
    vp_height: 400,
    id: 'simple',
    x_key: 'time',
    multi_y: false
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
    chart.model.plot({
        key: 'key3',
        color: 'red'
    });
    $('#trg').html(chart.view.render().el);
});
