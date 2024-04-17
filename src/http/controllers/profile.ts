import { type FastifyReply, type FastifyRequest } from 'fastify';

export async function profile(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> {
  return reply.status(200).send();
}
