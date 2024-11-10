const id = require('../util/id');
const gossipAll = require('../all/gossip');
const gossip = {};
const messageMap = new Map();

gossip.recv = function(payload, callback) {
  const message = payload.message;
  if (!messageMap.has(id.getID(message))) {
    const gossipTemplate = gossipAll(message[0]);
    gossipTemplate.send(payload.message, payload.remote, callback);
    messageMap.set(id.getID(message), message);
    global.distribution.local.comm.send(payload.message,
        {node: global.nodeConfig, service: payload.remote.service,
          method: payload.remote.method},
        (e, v) => {
          callback(e, v);
        });
  }
};

module.exports = gossip;
