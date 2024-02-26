const id = require('../util/id');
const gossipAll = require('../all/gossip');
const gossip = {};
const messageMap = new Map();

gossip.recv = function(payload, callback) {
  console.log('In local gossip: ' + JSON.stringify(payload));
  const message = payload.message;
  if (messageMap.has(id.getID(message))) {
  } else {
    gossipAll.send(payload.message, payload.remote);
    messageMap.set(id.getID(message), message);
    local.comm.send(payload.message, payload.remote, (e, v) => {
      callback(e, v);
    });
  }
};

module.exports = gossip;
