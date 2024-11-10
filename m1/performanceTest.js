const {performance} = require('perf_hooks');
const util = require('./distribution/util/serialization.js');

function createObjectWithElems(n) {
  let obj = {};
  for (let i = 0; i < n; i++) {
    obj[`key${i}`] = `value${i}`;
  }
  return obj;
}
  
function createObjectWithFuncs(n) {
  let obj = {};
  for (let i = 0; i < n; i++) {
    obj[`func${i}`] = function() { return i; };
  }
  return obj;
}

function createCyclicObject() {
  let obj = {};
  for (let i = 0; i < 1000; i++) {
    obj[`child${i}`] = { parent: obj };
  }
  return obj;
}
  
function measurePerformance(object, description) {
  const startTimeSerialize = performance.now();
  const serialized = util.serialize(object);
  const endTimeSerialize = performance.now();

  const startTimeDeserialize = performance.now();
  const deserialized = util.deserialize(serialized);
  const endTimeDeserialize = performance.now();

  console.log(`${description}:`);
  console.log(`Serialization time: ${endTimeSerialize - startTimeSerialize} ms`);
  console.log(`Deserialization time: ${endTimeDeserialize - startTimeDeserialize} ms`);
}
  
measurePerformance(createObjectWithElems(100), '100 elements');
measurePerformance(createObjectWithElems(1000), '1000 elements');
measurePerformance(createObjectWithElems(10000), '10000 elements');
measurePerformance(createObjectWithFuncs(100), '100 functions');
measurePerformance(createObjectWithFuncs(1000), '1000 functions');
measurePerformance(createObjectWithFuncs(10000), '10000 functions');
measurePerformance(createCyclicObject(), '1000 cycles');
measurePerformance(new Date(), 'Native objects');