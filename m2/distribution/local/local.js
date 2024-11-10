const http = require('http');

const id = require('../util/id');
const util = require('../util/util');

const node = global.config;

/*

Service  Description                           Methods
status   statusrmation about the current node  get
routes   A mapping from names to functions     get, put
comm     A message communication interface     send

*/

global.serviceMap = new Map();
global.counter = 0;

const status = {
  get: function(key, callback) {
    let value = null;
    let error = null;

    global.counter++;

    switch (key) {
      case 'sid':
        value = id.getSID(node);
        break;
      case 'nid':
        value = id.getNID(node);
        break;
      case 'ip':
        value = global.config.ip;
        break;
      case 'port':
        value = global.config.port;
        break;
      case 'counts':
        value = global.counter;
        break;
      default:
        error = new Error('Invalid key');
    }

    callback(error, value);
  },
};

const routes = {
  put: function(value, key, callback) {
    global.serviceMap.set(key, value);
    callback(null, null);
  },

  get: function(key, callback) {
    let value = null;
    let error = null;

    if (global.serviceMap.has(key)) {
      value = global.serviceMap.get(key);
    } else {
      error = new Error('Invalid key');
    }
    callback(error, value);
  },
};

const comm = {
  send: function(message, remote, callback) {
    const data = JSON.stringify({
      message: message,
    });

    const options = {
      hostname: remote.node.ip,
      port: remote.node.port,
      path: `/${remote.service}/${remote.method}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk.toString();
      });

      res.on('end', () => {
        callback(null, util.deserialize(rawData)[1]);
      });
    });

    req.write(data);
    req.end();
  },
};

global.serviceMap.set('status', status);
global.serviceMap.set('routes', routes);
global.serviceMap.set('comm', comm);

module.exports = {status, routes, comm};
