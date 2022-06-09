
import { FastifyPluginCallback } from 'fastify';
import { Rate } from '@prisma/client';
import { prisma } from '../db';
import dayjs from 'dayjs';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Params: { id: number }, Body: Rate }>('/api/patients/:id/rates', async (request, reply) => {

    //request.body.recordedAt = dayjs(request.body.recordedAt, 'YYYY-MM-DD HH:mm:ss').toDate();

    return await prisma.rate.create({
      data: {
        ...request.body,
        patientId: Number(request.params.id)
      }
    });

  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id/rates', async (request, reply) => {
    return prisma.rate.findMany({
      where: {
        patientId: Number(request.params.id)
      },
      orderBy: [
        { id: 'asc' }
      ]
    });
  });

  fastify.delete<{ Params: { id: number } }>('/api/rates/:id', async (request, reply) => {
    return prisma.rate.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
