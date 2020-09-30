"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findLCM = exports.findGCD = void 0;

var findGCD = function findGCD(x, y) {
  if (!Number.isInteger(x)) return;
  if (y === 0) return x;else return findGCD(y, x % y);
};

exports.findGCD = findGCD;

var findLCM = function findLCM(data) {
  if (!Array.isArray(data) || data.length < 1) return 0;
  var result = data[0];

  for (var index = 1; index < data.length; index++) {
    result = data[index] * result / findGCD(data[index], result);
  }

  return result;
};

exports.findLCM = findLCM;