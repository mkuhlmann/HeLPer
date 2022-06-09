import { prisma } from './db';
import { FastifyRequest } from 'fastify';

export const auditLogEvent = (request: FastifyRequest, event: string) => {
  const user = request.headers['x-user'] as string;
  const ip = request.ip;

  prisma.auditLog.create({
    data: {
      user,
      ip,
      event
    }
  }).then();
};

export const auditLogModel = (request: FastifyRequest, model: string, modelId: number, modelAction?: string) => {
  const user = request.headers['x-user'] as string;
  const ip = request.ip;

  if (!modelAction) {
    switch (request.method) {
      case 'GET':
        modelAction = 'read';
        break;
      case 'POST':
        modelAction = 'create';
        break;
      case 'PUT':
        modelAction = 'update';
        break;
      case 'DELETE':
        modelAction = 'delete';
        break;
    }
  };

  prisma.auditLog.create({
    data: {
      event: 'model',
      model,
      modelAction,
      modelId,
      user,
      ip
    }
  }).then();
};
