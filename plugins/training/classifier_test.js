
var natural = require('natural'),
    classifier = new natural.BayesClassifier();


classifier.addDocument('my unit-tests failed.', 'software');
classifier.addDocument('tried the program, but it was buggy.', 'software');
classifier.addDocument('the drive has a 2TB capacity.', 'hardware');
classifier.addDocument('i need a new power supply.', 'hardware');

classifier.train();

console.log(classifier.classify('did the tests pass?'));
console.log(classifier.classify('did you buy a new drive?'));