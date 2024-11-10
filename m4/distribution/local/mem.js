const mem = {};

global.KVStore = new Map();
global.KVStore.set('local', new Map());

function mapToObject(map) {
  const object = {};
  map.forEach((value, key) => {
    // Assuming that all values in the map are also maps
    // Convert them to objects as well
    object[key] = Object.fromEntries(value);
  });
  return object;
}

mem.get = function(key, callback) {
  let value = null;
  let error = null;

  let gid = (typeof key === 'object' && key !== null) ? key.gid : 'local';
  key = (typeof key === 'object' && key !== null) ? key.key : key;

  console.log('global kv: ' + global.KVStore);

  if (key == null) { // If key is null, return all existing keys in an array
    value = [...global.KVStore.get(gid).keys()];
  } else if (global.KVStore.has(gid) && global.KVStore.get(gid).has(key)) {
    value = global.KVStore.get(gid).get(key);
  } else {
    error = new Error('mem.get failure: invalid key');
  }
  callback(error, value);
};

mem.put = function(user, key, callback) {
  let gid = (typeof key === 'object' && key !== null) ? key.gid : 'local';
  key = (typeof key === 'object' && key !== null) ? key.key : key;

  if (key == null) {
    key = distribution.util.id.getID(user);
  }
  if (!global.KVStore.has(gid)) {
    global.KVStore.set(gid, new Map());
  }
  global.KVStore.get(gid).set(key, user);
  console.log('All KV:', JSON.stringify(mapToObject(global.KVStore), null, 2));

  callback(null, user);
};

mem.del = function(key, callback) {
  let value = null;
  let error = null;

  let gid = (typeof key === 'object' && key !== null) ? key.gid : 'local';
  key = (typeof key === 'object' && key !== null) ? key.key : key;

  if (global.KVStore.has(gid) && global.KVStore.get(gid).has(key)) {
    value = global.KVStore.get(gid).get(key);
    global.KVStore.get(gid).delete(key);
  } else {
    error = new Error('mem.del failure: invalid key');
  }
  callback(error, value);
};

module.exports = mem;
