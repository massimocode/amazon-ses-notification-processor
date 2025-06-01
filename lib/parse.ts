'use strict';

import ResultRecorder from './result-recorder';

let results = ResultRecorder.getResults();

console.log('COMPLAINTS');
let complaintsPerEmail = new Map<string, string[]>();
for (let complaint of results.complaints) {
  if (!complaintsPerEmail.has(complaint.FromEmail)) {
    complaintsPerEmail.set(complaint.FromEmail, []);
  }
  complaintsPerEmail.get(complaint.FromEmail).push(complaint.ToEmail);
}
for (let fromEmail of complaintsPerEmail.keys()) {
  console.log(`FROM ${fromEmail}`);
  for (let emailAddress of new Set(complaintsPerEmail.get(fromEmail))) {
    console.log(emailAddress);
  }
  console.log('\n\n\n')
}
results.complaints = [];



console.log('\n\n\nPERMANENT BOUNCES');
for (let bounce of new Set(results.bounces.filter(x => x.BounceType === 'Permanent').map(x => x.ToEmail))) {
  console.log(bounce);
}
results.bounces = results.bounces.filter(x => x.BounceType !== 'Permanent');



console.log('\n\n\nTRANSIENT BOUNCES');
let bounces = new Map<string, number>();
for (let bounce of results.bounces.map(x => x.ToEmail)) {
  if (bounces[bounce] === undefined) {
    bounces[bounce] = 0;
  }
  bounces[bounce]++;
}

// Transient bounced 3 times
let transientBounces = Array.from(bounces).filter(x => x[1] >= 3).map(x => x[0]);
transientBounces.forEach(console.log);

let setToExclude = new Set(transientBounces);
results.bounces = results.bounces.filter(x => setToExclude.has(x.ToEmail) === false);


console.log('\n\n\nERRORS');
for (let error of results.errors) {
  console.log(error);
}
results.errors = [];


ResultRecorder.save();