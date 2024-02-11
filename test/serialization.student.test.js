const util = require('../distribution').util;

test('(0 pts) Native Function test', () => {
  const object = {a: parseInt};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized.a).toBe(parseInt);
});


test('(0 pts) sample test', () => {
  const number = 42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

test('(0 pts) sample test', () => {
  const number = 42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

test('(0 pts) sample test', () => {
  const number = 42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

test('(0 pts) sample test', () => {
  const number = 42;
  const serialized = util.serialize(number);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(number);
});

