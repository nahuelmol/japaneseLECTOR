
var myString = "FOOLS..."
var numberOfPoints = (myString.match(/\./g) || []).length;

console.log(numberOfPoints)

var newstring  = myString.replace(/\./g, '');
console.log(newstring)