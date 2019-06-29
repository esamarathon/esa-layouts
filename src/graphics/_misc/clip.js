"use strict";
exports.__esModule = true;
exports.sortBoxCoor = function (boxCoor) {
    boxCoor.sort(function (a, b) { return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]; });
    return [boxCoor[0], boxCoor[1], boxCoor[3], boxCoor[2], boxCoor[0]];
};
exports.makeCoors = function (width, height, boxCoors) {
    boxCoors.sort(function (a, b) { return a[0][0] - b[0][0]; });
    var res = [[0, 0]];
    for (var _i = 0, boxCoors_1 = boxCoors; _i < boxCoors_1.length; _i++) {
        var boxCoor = boxCoors_1[_i];
        var entry = [boxCoor[0][0], 0];
        res.push.apply(res, [entry].concat(boxCoor, [entry]));
    }
    res.push([width, 0], [width, height], [0, height], [0, 0]);
    return res;
};
exports.outputCss = function (coors) {
    var polygon = coors
        .map(function (coor) { return coor.map(function (n) { return n + "px"; }).join(' '); })
        .join(', ');
    var css = "clip-path: polygon(" + polygon + ");";
    return css;
};
