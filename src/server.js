const Hapi = require('@hapi/hapi');
const routes = require('./routes');

(async function () {
  const server = Hapi.server({
    host: 'localhost',
    port: 9000
  });

  server.route(routes);

  await server.start();
  console.log(`Server listening on ${server.info.uri}`);
})();