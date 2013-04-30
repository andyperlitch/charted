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