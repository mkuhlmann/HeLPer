
import { createSecretKey } from 'crypto';
import { FastifyPluginCallback } from 'fastify';
import { SignJWT } from 'jose';


const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Body: { username: string, password: string } }>('/api/auth', async (request, reply) => {
    if (['admin', 'arzt', 'pflege'].indexOf(request.body.username) !== -1) {
      // @TODO .env in real world
      let key = createSecretKey(Buffer.from('helper-secret-jwt', 'base64'));
      let jwt = await new SignJWT({ 'sub': request.body.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .sign(key);
      return { 'jwt': jwt, 'user': request.body.username };
    }
    return reply.status(401).send({ 'error': 'Unauthorized' });
  });

};

export default plugin;
