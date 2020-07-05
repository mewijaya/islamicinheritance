"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var findGCD = exports.findGCD = function findGCD(x, y) {
  if (!Number.isInteger(x)) return;
  if (y === 0) return x;else return findGCD(y, x % y);
};

var findLCM = exports.findLCM = function findLCM(data) {
  if (!Array.isArray(data) && data.length < 2) return;

  var result = data[0];

  for (var index = 1; index < data.length; index++) {
    result = data[index] * result / findGCD(data[index], result);
  }

  return result;
};