import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { PrismaClient, Patient } from '@prisma/client';
import path from 'path';

const app = fastify();
const prisma = new PrismaClient();


if (process.env.NODE_ENV === 'production') {
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
  });
} else {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../../app/dist/spa'),
  });
}

app.get('/api/patients', async (request, reply) => {
  return prisma.patient.findMany();

});

app.get<{ Params: { id: number } }>('/api/patients/:id', async (request, reply) => {
  return await prisma.patient.findFirst({
    where: {
      id: Number(request.params.id),
    }
  });
});

app.post<{ Body: Patient }>('/api/patients', async (request, reply) => {
  return prisma.patient.create({
    data: {
      ...request.body
    }
  });
});

app.delete<{ Params: { id: number } }>('/api/patients/:id', async (request, reply) => {
  return prisma.patient.delete({
    where: {
      id: Number(request.params.id)
    }
  });
});


app.get<{ Params: { id: number } }>('/api/patients/:id/measurements', async (request, reply) => {
  return prisma.measurement.findMany({
    where: {
      patientId: Number(request.params.id)
    }
  });
});


app.listen(9001, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server ready at: http://localhost:9001`);
});
