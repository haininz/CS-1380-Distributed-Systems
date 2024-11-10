global.nodeConfig = {ip: '127.0.0.1', port: 8080};
const distribution = require('../distribution');
const id = distribution.util.id;

const groupsTemplate = require('../distribution/all/groups');
const mygroupGroup = {};

/*
   This hack is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

beforeAll((done) => {
  const n1 = {ip: '127.0.0.1', port: 8000};
  const n2 = {ip: '127.0.0.1', port: 8001};
  const n3 = {ip: '127.0.0.1', port: 8002};

  // First, stop the nodes if they are running
  let remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
      });
    });
  });

  mygroupGroup[id.getSID(n1)] = n1;
  mygroupGroup[id.getSID(n2)] = n2;
  mygroupGroup[id.getSID(n3)] = n3;

  // Now, start the base listening node
  distribution.node.start((server) => {
    localServer = server;
    // Now, start the nodes
    distribution.local.status.spawn(n1, (e, v) => {
      distribution.local.status.spawn(n2, (e, v) => {
        distribution.local.status.spawn(n3, (e, v) => {
          groupsTemplate({gid: 'mygroup'})
              .put('mygroup', mygroupGroup, (e, v) => {
                done();
              });
        });
      });
    });
  });
});

afterAll((done) => {
  distribution.mygroup.status.stop((e, v) => {
    const nodeToSpawn = {ip: '127.0.0.1', port: 8008};
    let remote = {node: nodeToSpawn, service: 'status', method: 'stop'};
    distribution.local.comm.send([], remote, (e, v) => {
      localServer.close();
      done();
    });
  });
});

test('(0 pts) all.status.get(sid)', (done) => {
  const sids = Object.values(mygroupGroup).map((node) => id.getSID(node));

  distribution.mygroup.status.get('sid', (e, v) => {
    expect(e).toEqual({});
    expect(Object.values(v).length).toBe(sids.length);
    expect(Object.values(v)).toEqual(expect.arrayContaining(sids));
    done();
  });
});

test('(0 pts) all.groups.get(random)', (done) => {
  distribution.mygroup.groups.get('random', (e, v) => {
    expect(e).toBeDefined();
    expect(v).toEqual({});
    done();
  });
});

test('(0 pts) all.comm.send(groups.add(browncs))', (done) => {
  let g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  const remote1 = {service: 'groups', method: 'put'};
  const remote2 = {service: 'groups', method: 'get'};

  const extract = (obj, key1, key2) => {
    const uniqueSet = new Set();
    Object.keys(obj).forEach((topLevelKey) => {
      const entry = JSON.stringify({
        [key1]: obj[topLevelKey][key1],
        [key2]: obj[topLevelKey][key2],
      });
      uniqueSet.add(entry);
    });

    return Array.from(uniqueSet).map((entry) => JSON.parse(entry))[0];
  };

  distribution.mygroup.comm.send(['browncs', g], remote1, (e, v) => {
    distribution.mygroup.comm.send(['browncs'], remote2, (e, v) => {
      expect(e).toEqual({});
      expect(extract(v, '507aa', '12ab0')).toEqual(g);
      done();
    });
  });
});

test('(0 pts) all.groups.put/del(browncs)/del(browncs)', (done) => {
  let g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.mygroup.groups.put('browncs', g, (e, v) => {
    distribution.mygroup.groups.del('browncs', (e, v) => {
      expect(e).toEqual({});
      Object.keys(mygroupGroup).forEach((sid) => {
        expect(v[sid]).toEqual(g);
      });
      distribution.mygroup.groups.del('browncs', (e, v) => {
        expect(e).toBeDefined();
        expect(v).toEqual({});
        done();
      });
    });
  });
});

test('(2 pts) all.groups.put(browncs)/rem(random)', (done) => {
  jest.setTimeout(10000);
  let g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.mygroup.groups.put('browncs', g, (e, v) => {
    distribution.mygroup.groups.rem('browncs', 'hz666', (e, v) => {
      expect(e).toBeDefined();
      expect(v).toEqual({});
      done();
    });
  });
});
