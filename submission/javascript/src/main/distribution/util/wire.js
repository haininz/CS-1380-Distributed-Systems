const id = require('../util/id');

global.funcMap = new Map();

function createRPC(func) {
  // Write some code...
  function stub(...args) {
    const callback = args.pop();
    if (typeof callback !== 'function') {
      throw new Error('Expected the last argument to be a callback function.');
    }

    let hashedFunc = id.getID(func);

    global.funcMap.set(hashedFunc, func);

    let remote = {
      node: global.config,
      service: 'rpcService',
      method: hashedFunc,
    };

    distribution.local.comm.send(args, remote, callback);
  };
  return stub;
}

/*
    The toAsync function converts a synchronous function that returns a value
    to one that takes a callback as its last argument and returns the value
    to the callback.
*/
function toAsync(func) {
  return function(...args) {
    const callback = args.pop() || function() {};
    try {
      const result = func(...args);
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  };
}

module.exports = {
  createRPC: createRPC,
  toAsync: toAsync,
};
