gossipTemplate = (config) => {
  let gid = config.gid || 'global';
  const gossip = {
    send: function(message, remote, callback) {
      // callback = callback || function(e, v) {console.log(e, v);};

      let payload = {message: message, remote: remote};
      console.log('In all gossip: ' + JSON.stringify(payload));
      console.log('gid: ' + payload.message[0]);
      global.distribution.local.groups.get(gid, (e, v) => {
        let value = {};
        let error = {};

        if (e != null) {
          console.log('all.gossip.send error');
          // if (callback) {
          callback(error, null);
          // }
          return;
        }

        console.log('Nodes in group (gid=' + gid + '): ' + JSON.stringify(v));
        const keys = Object.keys(v);
        const n = keys.length;
        let selectedKeys = [];

        while (selectedKeys.length < 2 && selectedKeys.length < n) {
          const randomKey = keys[Math.floor(Math.random() * n)];
          if (!selectedKeys.includes(randomKey)) {
            selectedKeys.push(randomKey);
          }
        }

        console.log('Selected keys: ' + selectedKeys);

        if (selectedKeys.length === 0) {
          console.log('No nodes available for selection.');
          callback({}, {});
          return;
        }

        let counter = 0;

        selectedKeys.forEach((key) => {
          console.log('Select Node: ' + JSON.stringify(v[key]));
          global.distribution.local.comm.send([payload], {node: v[key],
            service: 'gossip', method: 'recv'}, (e, v) => {
            if (v != null) {
              value[key] = v;
            }
            if (e != null) {
              error[key] = e;
            }
            counter++;
            if (counter === selectedKeys.length) {
              callback(error, value);
            }
          });
        });
      });
    },
  };

  return gossip;
};

module.exports = gossipTemplate;
