gossipTemplate = (config) => {
  let gid = config.gid || 'global';
  const gossip = {
    send: function(message, remote, callback) {
      let jsonMsg = {message: message, remote: remote};
      console.log('In all gossip: ' + JSON.stringify(jsonMsg));
      global.distribution[gid].comm.send({message: message, remote: remote},
          {service: 'gossip', method: 'recv'}, callback);
    },

  };

  return gossip;
};

module.exports = gossipTemplate;
