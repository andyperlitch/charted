var bormat = require('bormat');
exports.time = function(timestamp) {
    return (new Date(timestamp)).toLocaleTimeString();
}
exports.date = function(timestamp) {
    return (new Date(timestamp)).toLocaleDateString();
}
exports.datetime = function(timestamp) {
    return (new Date(timestamp)).toString();
}
exports.gmt = function(timestamp) {
    return (new Date(timestamp)).toGMTString();
}
exports.grouped = function(number) {
    return bormat.commaGroups(number);
}