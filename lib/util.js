exports.convertToRange = function(value, lower, upper, newRange) {
    if (!newRange) throw "newRange must be provided";
    var oldRange = upper - lower;
    var adjustedValue = value - lower;
    return (adjustedValue * newRange) / oldRange;
}

exports.addClass = function(element, classname) {
    element.node.className ? element.node.className.baseVal = classname : element.node.setAttribute('class',  classname);
    return element;
}

exports.createAxisLabel = function(number, real_interval) {
    var mag, 
        rounded, 
        digits_over,
        num_arr,
        splice_start, 
        splice_rmcount, 
        abs_number = Math.abs(number), 
        MAX_DIGITS = 5;
    
    var append = '';
    var levels = [
        [1000000000000000,'Q'],
        [1000000000000,'T'],
        [1000000000,'B'],
        [1000000,'M'],
        [1000,'K']
    ];
    
    for (var i=0; i < levels.length; i++) {
        var lowerBound = levels[i][0];
        var abbr = levels[i][1];
        
        if (abs_number >= lowerBound) {
            append = abbr;
            number /= lowerBound;
            real_interval /= lowerBound;
            break;
        }
    };
    
    // Create magnitude factor
    mag = Math.log(real_interval) / Math.log(10);
    mag = Math.floor(mag);
    mag = Math.pow( 10, mag*-1 );
    mag *= 10;
    
    // Round number with magnitude, then cast as string
    rounded = mag < 1 ? Math.round(number) : Math.round( number * mag ) / mag;
    rounded = rounded + '';
    
    // Determine if too many digits are there
    digits_over = rounded.replace(/[\.]/g,'').length - MAX_DIGITS;
    
    if (digits_over > 0) {
        num_arr = rounded.split('');
        splice_start = rounded.indexOf('.') + 1;
        splice_rmcount = digits_over + 1;
        num_arr.splice(splice_start, splice_rmcount, '…');
        rounded = num_arr.join('');
    }
    
    return rounded + append;
}