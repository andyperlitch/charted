var _ = require('underscore'), Backbone = require('backbone');
var Chart = require('../../');
var now = +new Date();
var dz = [
   { key2: 45, key3: 311, time: now },
   { key1: 1.19, key3: 193, time: now + 60000 },
   { key1: 1, key2: 93, time: now + 105000 },
   { key1: 1.02, key2: 12, key3: 204, time: now + 120000 },
   { key1: 1.04, key2: 77, key3: 489, time: now - 50000 }
];

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
        color: 'green',
        visible: true
    });
    chart.plot({
        key: 'key2',
        color: 'blue',
        visible: false
    });
    chart.plot({
        key: 'key3',
        color: 'red',
        visible: false
    });
    $('#trg').html(chart.view.render().el);
});
