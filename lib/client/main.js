'use strict';

require('babel/polyfill');
var _ = require('lodash');

const hello = _.camelCase('hello dude');

var fn = function* () {
	yield 1;
	yield 2;
	yield hello;
};

var test = fn();
console.log(test.next().value);
console.log(test.next().value);
console.log(test.next().value);
