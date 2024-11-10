const { performance } = require('perf_hooks');
const distribution = require('./distribution');
const { createRPC, toAsync } = distribution.util.wire;

let n = 0;
const addOne = () => ++n;
const addOneAsync = toAsync(addOne);
const addOneRPC = createRPC(addOneAsync);

distribution.node.start((server) => {
  distribution.local.routes.put({ addOneRPC: addOneRPC }, 'rpcService', () => {
    console.log('RPC Service registered');
    
    const numRequests = 1000;
    let completedRequests = 0;
    const start = performance.now();

    for (let i = 0; i < numRequests; i++) {
      addOneRPC((err, result) => {
        completedRequests++;
        if (completedRequests === numRequests) {
          const end = performance.now();
          const duration = end - start;
          const rps = numRequests / (duration / 1000);
          console.log(`Average throughput: ${rps.toFixed(2)} requests per second`);
          console.log(`Average latency: ${(duration / numRequests).toFixed(2)} ms`);
          server.close();
        }
      });
    }
  });
});
