import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UserWithEmailNotFoundError } from '@/user/domain/errors/user-with-email-not-found-error';
import { UserWithIdNotFoundError } from '@/user/infrastructure/errors/user-with-id-not-found-error';

@Catch(
  UserWithEmailNotFoundError,
  UserWithIdNotFoundError
)
export class NotFoundErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
