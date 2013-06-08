var bormat = require('bormat');
exports.time = function(timestamp) {
    return (new Date(timestamp*1)).toLocaleTimeString();
}
exports.date = function(timestamp) {
    return (new Date(timestamp*1)).toLocaleDateString();
}
exports.datetime = function(timestamp) {
    var date = new Date(timestamp*1);
    return date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
}
exports.gmt = function(timestamp) {
    return (new Date(timestamp*1)).toGMTString();
}
exports.grouped = function(number) {
    return bormat.commaGroups(number);
}