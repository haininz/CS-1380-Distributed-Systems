
/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/
const http = require('http');
const url = require('url');

const local = require('../local/local');
const util = require('../util/util');

const start = function(started) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */

    // Write some code...
    if (req.method !== 'PUT') {
      res.writeHead(405);
      res.end('Only PUT Method is Allowed');
    }

    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */


    // Write some code...
    console.log("url: " + req.url);

    const urlSplit = req.url.trim().split('/');
    const service = urlSplit[1];
    const method = urlSplit[2];

    console.log("service: " + service + "; method: " + method); // service: status, method: get


    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */

    // Write some code...
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    /* Here, you can handle the service requests. */
    // Write some code...?

    /*
      Here, we provide a default callback which will be passed to services.
      It will be called by the service with the result of it's call
      then it will serialize the result and send it back to the caller.
    */
    const serviceCallback = (e, v) => {
      res.end(util.serialize([e, v]));
    };

    // Write some code...
    req.on('end', () => {
      console.log("data: " + body);
      try {
        local.routes.get(service, (e, v) => {
          if (e !== null) {
            console.error("Error routing");
          } else {
            // v[method](...JSON.parse(body).message, (e, v) => {
            //   console.log("res e: " + e);
            //   console.log("res v: " + v);
            // });

            v[method](...JSON.parse(body).message, serviceCallback);
          }
        });
      } catch (error) {
        console.log("error: " + error);
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
  });


  /*
    Your server will be listening on the port and ip specified in the config
    You'll need to call the started callback when your server has successfully
    started.

    In this milestone, you'll be passing the server object to this callback
    so that we can close the server when we're done with it.
    In future milestones, we'll add the abilitiy to stop the node
    through the service interface.
  */

  server.listen(global.config.port, global.config.ip, () => {
    started(server);
  });
};

module.exports = {
  start: start,
};
