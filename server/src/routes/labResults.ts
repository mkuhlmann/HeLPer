
import { FastifyPluginCallback } from 'fastify';
import { LabResult } from '@prisma/client';
import { prisma } from '../db';
import dayjs from 'dayjs';
import { auditLogModel } from '../audit';
import { authHook } from '../authHook';

const plugin: FastifyPluginCallback = async (fastify, options, next) => {

  fastify.post<{ Params: { id: number }, Body: LabResult }>('/api/patients/:id/lab-results', { preHandler: [authHook] }, async (request, reply) => {

    request.body.recordedAt = dayjs(request.body.recordedAt, 'YYYY-MM-DD HH:mm:ss').toDate();

    const labResult = await prisma.labResult.create({
      data: {
        ...request.body,
        patientId: Number(request.params.id)
      }
    });

    auditLogModel(request, 'LabResult', labResult.id);

    return labResult;

  });

  fastify.get<{ Params: { id: number } }>('/api/patients/:id/lab-results', { preHandler: [authHook] }, async (request, reply) => {
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

  fastify.delete<{ Params: { id: number } }>('/api/lab-results/:id', { preHandler: [authHook] }, async (request, reply) => {
    auditLogModel(request, 'LabResult', Number(request.params.id));

    return await prisma.labResult.delete({
      where: {
        id: Number(request.params.id)
      }
    });
  });

};

export default plugin;
