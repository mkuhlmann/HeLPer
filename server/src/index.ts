import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyAutoload from '@fastify/autoload';

import path from 'path';

const app = fastify({
});


if (process.env.NODE_ENV === 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
  });
} else {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../../app/dist/spa'),
  });
}

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
  dirNameRoutePrefix: false
});


app.listen(9001, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server ready at: ${address}`);
});
