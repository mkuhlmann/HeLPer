
import { FastifyPluginCallback } from 'fastify';
import { Patient } from '@prisma/client';
import { prisma } from '../db';
import { authHook } from '../authHook';
import { auditLogModel } from '../audit';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {
  fastify.get('/api/patients', { preHandler: [authHook] }, async (request, reply) => {
    return prisma.patient.findMany();

  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id', async (request, reply) => {
    return await prisma.patient.findFirst({
      where: {
        id: Number(request.params.id),
      }
    });
  });

  fastify.post<{ Body: Patient }>('/api/patients', { preHandler: [authHook] }, async (request, reply) => {
    const patient = await prisma.patient.create({
      data: {
        ...request.body
      }
    });

    auditLogModel(request, 'Patient', patient.id);

    return patient;
  });

  fastify.delete<{ Params: { id: number } }>('/api/patients/:id', { preHandler: [authHook] }, async (request, reply) => {
    auditLogModel(request, 'Patient', Number(request.params.id));

    return prisma.patient.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
