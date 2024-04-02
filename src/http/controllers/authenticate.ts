import { type FastifyReply, type FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({ email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(400).send({
        message: error.message
      });
    }
    throw error;
  }
  return reply.status(200).send();
}
