const memTemplate = (config) => {
  let gid = config.gid || 'global';
  let hash = config.hash || distribution.util.id.naiveHash;
  let allNodes;
  let nids;

  function init() {
    global.distribution.local.groups.get(gid, (e, v) => {
      if (e !== null) {
        console.error('Failed to get all nodes from memTemplate.');
      } else {
        allNodes = v;
        console.log('allNodes: ' + JSON.stringify(allNodes).toString());
        nids = Object.values(allNodes).map((node) => {
          return distribution.util.id.getNID(node);
        });
      }
      console.log('nids: ' + nids);
    });
  }

  const mem = {
    put: function(user, key, callback) {
      init();
      if (key == null) {
        let length = nids.length;
        let cur = 0;
        let error = {};
        let value = [];
        nids.forEach((nid, index) => {
          let node = allNodes[nid.substring(0, 5)];
          global.distribution.local.comm.send([user, {key: key, gid: gid}],
              {node: node, service: 'mem', method: 'put'}, (e, v) => {
                // if (e != null) {
                //   console.log('res err: ' + JSON.stringify(e));
                // }
                value.push(v);
                cur++;
                if (cur == length) {
                  // console.log('res value: ' + JSON.stringify(value));
                  callback(error, value.flat());
                }
              });
        });
      } else {
        let kid = distribution.util.id.getID(key);
        // console.log('kid: ' + kid);
        let nid = hash(kid, nids);
        // console.log('Selected nid: ' + nid);
        let node = allNodes[nid.substring(0, 5)];
        // console.log('Selected node: ' + JSON.stringify(node).toString());

        global.distribution.local.comm.send([user, {key: key, gid: gid}],
            {node: node, service: 'mem', method: 'put'}, (e, v) => {
              // console.log('result e from local mem: ' + JSON.stringify(e));
              // console.log('result v from local mem: ' + JSON.stringify(v));
              callback(e, v);
            });
      }
    },

    get: function(key, callback) {
      init();
      if (key == null) {
        let length = nids.length;
        let cur = 0;
        let error = {};
        let value = [];
        nids.forEach((nid, index) => {
          let node = allNodes[nid.substring(0, 5)];
          global.distribution.local.comm.send([{key: key, gid: gid}],
              {node: node, service: 'mem', method: 'get'}, (e, v) => {
                value.push(v);
                cur++;
                if (cur == length) {
                  callback(error, value.flat());
                }
              });
        });
      } else {
        let kid = distribution.util.id.getID(key);
        let nid = hash(kid, nids);
        let node = allNodes[nid.substring(0, 5)];
        global.distribution.local.comm.send([{key: key, gid: gid}],
            {node: node, service: 'mem', method: 'get'}, (e, v) => {
              callback(e, v);
            });
      }
    },

    del: function(key, callback) {
      init();
      let kid = distribution.util.id.getID(key);
      let nid = hash(kid, nids);
      let node = allNodes[nid.substring(0, 5)];
      global.distribution.local.comm.send([{key: key, gid: gid}],
          {node: node, service: 'mem', method: 'del'}, (e, v) => {
            // console.log('result e from local mem: ' + JSON.stringify(e));
            // console.log('result v from local mem: ' + JSON.stringify(v));
            callback(e, v);
          });
    },

  };

  return mem;
};

module.exports = memTemplate;
