import { createSecretKey } from 'crypto';
import { preHandlerAsyncHookHandler } from 'fastify';
import { jwtVerify } from 'jose';



export const authHook: preHandlerAsyncHookHandler = async (request, reply) => {
  if (!request.headers['authorization'] || !request.headers['authorization'].startsWith('Bearer ')) {
    return reply.status(401).send({ 'error': 'Unauthorized' });
  }
  const jwt = request.headers['authorization'].split(' ')[1];
  let key = createSecretKey(Buffer.from('helper-secret-jwt', 'base64'));
  const verify = await jwtVerify(jwt, key);

  if (['admin', 'arzt', 'pflege'].indexOf(verify.payload.sub) == -1) {
    return reply.status(401).send({ 'error': 'Unauthorized' });
  }

  request.headers['x-user'] = verify.payload.sub;
};
