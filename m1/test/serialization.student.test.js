const util = require('../distribution').util;

test('(0 pts) Native Function Test', () => {
  const object = {a: parseInt};
  const serialized = util.serialize(object);
  const deserialized = util.deserialize(serialized);
  expect(deserialized.a).toBe(parseInt);
});


test('(0 pts) Boolean Test', () => {
  const booleanValue = true;
  const serialized = util.serialize(booleanValue);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toBe(booleanValue);
});

test('(0 pts) Function Without Closure Test', () => {
  const fn = new Function('a', 'return a + 42;');
  const serialized = util.serialize(fn);
  const deserialized = util.deserialize(serialized);
  expect(typeof deserialized).toBe('function');
  expect(deserialized(10)).toBe(52);
});

test('(0 pts) Mixed Type Array Test', () => {
  const mixedArray = [42, "Hello, world!", true, {a: 1, b: "test"}, null];
  const serialized = util.serialize(mixedArray);
  const deserialized = util.deserialize(serialized);
  expect(deserialized).toEqual(mixedArray);
});

test('(0 pts) Rainbow Object Test', () => {
  const objectWithMethod = {
    a: 1,
    b: "test",
    c: function() { return "Hello, world!"; }
  };
  const serialized = util.serialize(objectWithMethod);
  const deserialized = util.deserialize(serialized);
  expect(deserialized.a).toBe(objectWithMethod.a);
  expect(deserialized.b).toBe(objectWithMethod.b);
  expect(typeof deserialized.c).toBe('function');
});

