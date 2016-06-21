'use strict';

import ResultRecorder from './result-recorder';

let results = ResultRecorder.getResults();

console.log('COMPLAINTS');
for (let complainer of new Set(results.complaints.map(x => x.ToEmail))) {
  console.log(complainer);
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



ResultRecorder.save();