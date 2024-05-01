const mr = function(config) {
  let context = {};
  context.gid = config.gid || 'all';

  let mrServiceId = 100;

  return {
    exec: (configuration, callback) => {
      const {keys, map, reduce} = configuration;

      const mrService = {};

      // Wrap map function
      mrService.mapper = function(map, gid, keys, callback) {
        let counter = 0;
        let mapResults = [];
        keys.forEach((key) => {
          global.distribution.local.store.get({key: key, gid: gid}, (e, v) => {
            counter++;
            if (v != null) {
              const mapOutput = map(key, v);
              mapResults = mapResults.concat(mapOutput);
              global.distribution.local.store.put(mapOutput,
                  {key: key, gid: gid},
                  (e, v) => {
                    if (counter == keys.length) {
                      // Print out map results on current node
                      console.log('mapResults: ');
                      mapResults.forEach((map, index) => {
                        console.log(map);
                      });
                      console.log('--Current node finished mapping--');
                      callback(e, mapResults);
                    }
                  });
            }
          });
        });
      };
      mrService.reducer = reduce;
      mrServiceId++;

      // Register mr-<id> service on each node
      global.distribution[context.gid].routes.put(mrService,
          'mr-' + String(mrServiceId),
          (e, v) => {
            // Each node do map
            global.distribution[context.gid].comm.send([map, context.gid, keys],
                {service: 'mr-' + String(mrServiceId), method: 'mapper'},
                (e, v) => {
                  let asyncCounter = 0;
                  let mapResults = [];
                  keys.forEach((key) => {
                    global.distribution[context.gid].comm.send(
                        [{key: key, gid: context.gid}],
                        {service: 'store', method: 'get'},
                        (e, v) => {
                          asyncCounter++;
                          mapResults = mapResults.concat(Object.values(v));
                          // console.log('Current e: ' + JSON.stringify(e));
                          // console.log('Current v: ' + JSON.stringify(v));
                          if (asyncCounter === keys.length) {
                            // Flat the array
                            mapResults = [].concat(...mapResults);
                            let shuffleResults = mapResults.reduce(
                                (acc, curr) => {
                                  const [mapKey, value] =
                                    Object.entries(curr)[0];
                                  acc[mapKey] = acc[mapKey] || [];
                                  acc[mapKey].push(value);
                                  return acc;
                                }, {});

                            let reducedResults = Object.keys(shuffleResults)
                                .map((word) => {
                                  return reduce(word, shuffleResults[word]);
                                });
                            callback(null, reducedResults);
                          }
                        });
                  });
                });
          });

      // let asyncCounter = 0;
      // let mapResults = [];

      // keys.forEach((key) => {
      //   global.distribution[context.gid].store.get(key, (e, v) => {
      //     if (e) {
      //       console.error('Error retrieving value for key: ', key);
      //       return;
      //     }

      //     const mapOutput = map(key, v);
      //     mapResults = mapResults.concat(mapOutput);

      //     asyncCounter++;
      //     if (asyncCounter === keys.length) {
      //       // Shuffle: Aggregate map results by keys
      //       let shuffleResults = mapResults.reduce((acc, curr) => {
      //         const [mapKey, value] = Object.entries(curr)[0];
      //         acc[mapKey] = acc[mapKey] || [];
      //         acc[mapKey].push(value);
      //         return acc;
      //       }, {});

      //       let reducedResults = Object.keys(shuffleResults).map((word) => {
      //         return reduce(word, shuffleResults[word]);
      //       });

      //       callback(null, reducedResults);
      //     }
      //   });
      // });
    },
  };
};

module.exports = mr;
