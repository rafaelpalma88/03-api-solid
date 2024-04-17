import { type FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';

export async function appRoutes(app: FastifyInstance): Promise<any> {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  /* Authenticated */
  app.get('/me', profile);
}
