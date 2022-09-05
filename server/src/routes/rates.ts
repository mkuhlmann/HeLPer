
import { FastifyPluginCallback } from 'fastify';
import { Rate } from '@prisma/client';
import { prisma } from '../db';
import { auditLogModel } from '../audit';
import { authHook } from '../authHook';


const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Params: { id: number }, Body: Rate }>('/api/patients/:id/rates', { preHandler: [authHook] }, async (request, reply) => {

    const user = request.headers['x-user'] as string;

    if (user != 'arzt') {
      reply.status(401).send({ 'eror': 'Unauthorized' });
    }

    const rate = await prisma.rate.create({
      data: {
        ...request.body,
        patientId: Number(request.params.id)
      }
    });
    auditLogModel(request, 'Rate', rate.id);

    return rate;
  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id/rates', { preHandler: [authHook] }, async (request, reply) => {
    return prisma.rate.findMany({
      where: {
        patientId: Number(request.params.id)
      },
      orderBy: [
        { id: 'desc' }
      ]
    });
  });

  fastify.delete<{ Params: { id: number } }>('/api/rates/:id', { preHandler: [authHook] }, async (request, reply) => {

    auditLogModel(request, 'Rate', Number(request.params.id));

    return prisma.rate.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
