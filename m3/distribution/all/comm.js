const local = require('../local/local');

commTemplate = (config) => {
  let gid = config.gid;
  const comm = {
    /**
     *
     * @param {*} message ['nid']
     * @param {*} remote {service: 'status', method: 'get'}
     * @param {*} callback
     */
    send: function(message, remote, callback) {
      local.groups.get(gid, (e, v) => {
        /*
        v = {
          '507aa': {ip: '127.0.0.1', port: 8080},
          '12ab0': {ip: '127.0.0.1', port: 8081},
        }
        */

        let value = {};
        let error = {};

        let n = Object.keys(v).length;
        let counter = 0;

        if (e != null) {
          console.log('commTemplate.comm.send error');
        } else { // Send to each node with group_id = gid
          Object.keys(v).forEach((key) => {
            local.comm.send(
                message, {node: v[key],
                  service: remote.service, method: remote.method},
                (e, v) => {
                  if (v != null) {
                    value[key] = v;
                  }
                  if (e != null) {
                    error[key] = e;
                  }
                  counter++;
                  if (counter == n) {
                    callback(error, value);
                  }
                },
            );
          });
        }
      });
    },
  };
  return comm;
};

module.exports = commTemplate;
