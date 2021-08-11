// main.js
var counter = require('./module2').counter;
var incCounter = require('./module2').incCounter;

console.log(counter());  // 3
incCounter();
console.log(counter()); // 4