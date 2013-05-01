# Charted

A charting module written with backbone and raphael. Best used with [browserify](http://browserify.org).


## usage
    
    // initial data
    var data = [ 
        { key1: 4, time: 1367390411059 },
        { key1: 2, time: 1367390412059 },
        { key1: 3, time: 1367390413059 }
    ];
    
    // set up chart instance
    var Charted = require('charted');
    var chart = new Charted({ 
        x_key: "time",
        data: data
    });
    
    // set series to plot
    chart.plot({
       key: 'key1',
       color: 'red' 
    });
    

