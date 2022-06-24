
import { FastifyPluginCallback } from 'fastify';
import { LabResult } from '@prisma/client';
import { prisma } from '../db';
import dayjs from 'dayjs';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Params: { id: number }, Body: LabResult }>('/api/patients/:id/lab-results', async (request, reply) => {

    request.body.recordedAt = dayjs(request.body.recordedAt, 'YYYY-MM-DD HH:mm:ss').toDate();

    return await prisma.labResult.create({
      data: {
        ...request.body,
        patientId: Number(request.params.id)
      }
    });

  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id/lab-results', async (request, reply) => {
    return prisma.labResult.findMany({
      where: {
        patientId: Number(request.params.id)
      },
      orderBy: [
        { recordedAt: 'desc' },
        { id: 'asc' }
      ]
    });
  });

  fastify.delete<{ Params: { id: number } }>('/api/lab-results/:id', async (request, reply) => {
    return prisma.labResult.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
