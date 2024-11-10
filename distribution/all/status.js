const local = require('../local/local');

statusTemplate = (config) => {
  let gid = config.gid || 'global';
  const status = {
    stop: function(callback) {
      global.distribution[gid].comm.send([],
          {service: 'status', method: 'stop'}, callback);
    },

    get: function(key, callback) {
      global.distribution[gid].comm.send([key],
          {service: 'status', method: 'get'}, (e, v) => {
            if (key == 'heapTotal') {
              const sum = Object.values(v).reduce((a, c) => {
                return a + c;
              }, 0);
              callback(e, sum);
            } else {
              callback(e, v);
            }
          });
    },

    spawn: function(node, callback) {
      local.status.spawn(node, (e, v) => {
        local.groups.add(gid, node, ()=>{});
        global.distribution[gid].comm.send([gid, node],
            {service: 'groups', method: 'add'}, ()=>{});
        callback(e, v);
      },
      );
    },

  };

  return status;
};

module.exports = statusTemplate;
