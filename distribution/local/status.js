const id = require('../util/id');
const {serialize} = require('../util/util');
const childProcess = require('child_process');
const path = require('path');

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() {};

  if (configuration in global.nodeConfig) {
    callback(null, global.nodeConfig[configuration]);
  } else if (configuration in moreStatus) {
    callback(null, moreStatus[configuration]);
  } else if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
  } else if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
  } else {
    callback(new Error('Status key not found'));
  }
};

status.spawn = function(node, callback) {
  node.onStart = node.onStart || function() {};

  node.onStart = new Function(
      `
        let originalOnStart = ${node.onStart.toString()};
        let callbackRPC = ${distribution.util.wire.createRPC(
      distribution.util.wire.toAsync(callback)).toString()};

        originalOnStart();
        callbackRPC(null, global.nodeConfig, ()=>{});
    `,
  );

  childProcess.spawn('node', [
    path.join(__dirname, '../../distribution.js'),
    '--config',
    serialize(node)],
  {
    detached: true,
  });
};

status.stop = function(callback) {
  callback(null, global.nodeConfig);
  process.exit(0);
};

module.exports = status;
