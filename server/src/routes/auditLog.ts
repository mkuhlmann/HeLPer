
import { FastifyPluginCallback } from 'fastify';
import { Rate } from '@prisma/client';
import { prisma } from '../db';
import { auditLogModel } from '../audit';
import { authHook } from '../authHook';


const plugin: FastifyPluginCallback = async (fastify, options, next) => {



  fastify.get<{ Params: { id: number } }>('/api/audit-log', { preHandler: [authHook] }, async (request, reply) => {
    const user = request.headers['x-user'] as string;

    if (user != 'admin') {
      reply.status(401).send({ 'eror': 'Unauthorized' });
    }

    return prisma.auditLog.findMany({
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
  });


};

export default plugin;
