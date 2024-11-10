routesTemplate = (config) => {
  let gid = config.gid || 'global';
  const routes = {
    put: function(value, key, callback) {
      global.distribution[gid].comm.send([value, key],
          {service: 'routes', method: 'put'}, callback);
    },
  };

  return routes;
};

module.exports = routesTemplate;
