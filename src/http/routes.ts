import { type FastifyInstance } from 'fastify';
import { register } from './controllers/register';

export async function appRoutes(app: FastifyInstance): Promise<any> {
  app.post('/users', register);
}
