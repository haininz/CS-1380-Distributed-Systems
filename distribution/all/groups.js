groupsTemplate = (config) => {
  let gid = config.gid || 'global';
  const groups = {
    put: function(key, nodeGroup, callback) {
      global.distribution.local.groups.put(key, nodeGroup, (e, v) => {
        /*
        v = {
          '507aa': {ip: '127.0.0.1', port: 8080},
          '12ab0': {ip: '127.0.0.1', port: 8081},
        }
        */

        if (e != null) {
          console.log('groupsTemplate.groups.put error: ' + e);
        } else { // Send to each node with group_id = gid
          global.distribution[gid].comm.send([key, nodeGroup],
              {service: 'groups', method: 'put'}, callback);
        }
      });
    },

    del: function(key, callback) {
      global.distribution[gid].comm.send([key],
          {service: 'groups', method: 'del'}, callback);
    },

    get: function(key, callback) {
      global.distribution[gid].comm.send([key],
          {service: 'groups', method: 'get'}, callback);
    },

    add: function(key, node, callback) {
      global.distribution[gid].comm.send([key, node],
          {service: 'groups', method: 'add'}, callback);
    },

    rem: function(key, nodeName, callback) {
      global.distribution[gid].comm.send([key, nodeName],
          {service: 'groups', method: 'rem'}, callback);
    },

  };

  return groups;
};

module.exports = groupsTemplate;

