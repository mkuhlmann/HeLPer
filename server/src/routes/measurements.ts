
import { FastifyPluginCallback } from 'fastify';
import { Measurement } from '@prisma/client';
import { prisma } from '../db';
import dayjs from 'dayjs';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Params: { id: number }, Body: Measurement }>('/api/patients/:id/measurements', async (request, reply) => {

    request.body.recordedAt = dayjs(request.body.recordedAt, 'YYYY-MM-DD HH:mm:ss').toDate();
    console.log(request.body);
    return await prisma.measurement.create({
      data: {
        ...request.body,
        patientId: Number(request.params.id)
      }
    });
  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id/measurements', async (request, reply) => {
    return prisma.measurement.findMany({
      where: {
        patientId: Number(request.params.id)
      },
      orderBy: [
        { recordedAt: 'asc' },
        { id: 'asc' }
      ]
    });
  });
};

export default plugin;
