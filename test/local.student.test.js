let distribution;
let local;
let routes;
let status;
let node;

// let lastPort = 8080;

beforeEach(() => {
  jest.resetModules();

  // global.config = {
  //   ip: '127.0.0.1',
  //   port: lastPort++,
  // };

  distribution = require('../distribution');
  local = distribution.local;

  status = local.status;
  routes = local.routes;

  wire = distribution.util.wire;

  node = global.config;
});

test('(0 pts) Random status Test', () => {
  status.get('', (e, v) => {
    expect(e).toBeDefined();
    expect(e).toBeInstanceOf(Error);
    expect(v).toBeFalsy();
  });
});

test('(0 pts) Random route Test', () => {
  routes.get('', (e, v) => {
    expect(e).toBeDefined();
    expect(e).toBeInstanceOf(Error);
    expect(v).toBeFalsy();
  });
});

test('(0 pts) RPC Test', () => {
  let n = 0;

  const subOne = () => {
    return --n;
  };

  const subOneRPC = distribution.util.wire.createRPC(
      distribution.util.wire.toAsync(subOne));

  const rpcService = {
    subOneRPC: subOneRPC,
  };

  distribution.node.start((server) => {
    routes.put(rpcService, 'rpc', (e, v) => {
      routes.get('rpc', (e, s) => {
        expect(e).toBeFalsy();
        s.subOneRPC((e, v) => {
          s.subOneRPC((e, v) => {
            s.subOneRPC((e, v) => {
              server.close();
              expect(e).toBeFalsy();
              expect(v).toBe(-3);
            });
          });
        });
      });
    });
  });
});

test('(0 pts) Additional status Test', () => {
  status.get('port', (e, v) => {
    expect(e).toBeFalsy();
    expect(v).toBe(node.port);
  });
});

test('(0 pts) Additional route Test', () => {
  const testService = {};

  testService.print = () => {
    return 'Hello World!';
  };

  routes.put(testService, 'print', (e, v) => {
    routes.get('print', (e, v) => {
      expect(e).toBeFalsy();
      expect(v.print()).toBe('Hello World!');
    });
  });
});
