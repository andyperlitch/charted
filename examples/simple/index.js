var _ = require('underscore'), Backbone = require('backbone');
var Chart = require('../../');
var dz = [
   { key2: 45, key3: 311, time: 1367296690307 },
   { key1: 4, key3: 193, time: 1367296692807 },
   { key1: 1, key2: 93, time: 1367296693807 },
   { key1: 8, key2: 12, key3: 204, time: 1367296691807 },
   { key1: 3, key2: 77, key3: 489, time: 1367296694807 }
];

var dz = [];
var chart = window.chart = new Chart({
    data: dz,
    id: 'simple',
    x_key: 'time',
    x_axis_formatter: 'time',
    multi_y: false
});
$(function() {
    chart.plot({
        key: 'key1',
        color: 'green'
    });
    chart.plot({
        key: 'key2',
        color: 'blue'
    });
    chart.plot({
        key: 'key3',
        color: 'red'
    });
    $('#trg').html(chart.view.render().el);
});
