const id = require('../util/id');

const groups = {};

global.nodeGroupMap = new Map();

groups.get = function(key, callback) {
  let value = null;
  let error = null;

  if (global.nodeGroupMap.has(key)) {
    value = global.nodeGroupMap.get(key);
  } else {
    error = new Error('group.get failure: invalid key');
  }
  callback(error, value);
};

groups.put = function(key, nodeGroup, callback) {
  global.nodeGroupMap.set(key, nodeGroup);

  global.distribution[key] = {};
  global.distribution[key].status = require('../all/status')({gid: key});
  global.distribution[key].comm = require('../all/comm')({gid: key});
  global.distribution[key].groups = require('../all/groups')({gid: key});
  global.distribution[key].routes = require('../all/routes')({gid: key});
  global.distribution[key].gossip = require('../all/gossip')({gid: key});

  callback(null, nodeGroup);
};

groups.add = function(key, node, callback) {
  callback = callback || function() {};

  let value = null;
  let error = null;

  if (global.nodeGroupMap.has(key)) {
    global.nodeGroupMap.get(key)[id.getSID(node)] = node;
  } else {
    error = new Error('group.add failure: invalid key');
  }
  callback(error, value);
};

groups.rem = function(key, nodeName, callback) {
  callback = callback || function() {};

  let value = null;
  let error = null;

  if (global.nodeGroupMap.has(key)) {
    const group = global.nodeGroupMap.get(key);
    if (nodeName in group) {
      delete group[nodeName];
    } else {
      error = new Error('group.rem failure: node to delete not found in group');
    }
  } else {
    error = new Error('group.rem failure: invalid key');
  }
  callback(error, value);
};

groups.del = function(key, callback) {
  let value = null;
  let error = null;

  if (global.nodeGroupMap.has(key)) {
    value = global.nodeGroupMap.get(key);
    global.nodeGroupMap.delete(key);
  } else {
    error = new Error('group.del failure: invalid key');
  }
  callback(error, value);
};

module.exports = groups;
