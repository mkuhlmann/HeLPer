
import { FastifyPluginCallback } from 'fastify';
import { Patient } from '@prisma/client';
import { prisma } from '../db';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {
  fastify.get('/api/patients', async (request, reply) => {
    return prisma.patient.findMany();

  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id', async (request, reply) => {
    return await prisma.patient.findFirst({
      where: {
        id: Number(request.params.id),
      }
    });
  });

  fastify.post<{ Body: Patient }>('/api/patients', async (request, reply) => {
    return prisma.patient.create({
      data: {
        ...request.body
      }
    });
  });

  fastify.delete<{ Params: { id: number } }>('/api/patients/:id', async (request, reply) => {
    return prisma.patient.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
