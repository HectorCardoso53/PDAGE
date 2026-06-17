import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Erro de tamanho de arquivo (Multer LIMIT_FILE_SIZE)
    if (exception?.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({
        statusCode: 400,
        message: 'Arquivo muito grande. O tamanho máximo por arquivo é 20 MB.',
        error: 'Bad Request',
      });
    }

    // Erro de formato de arquivo (fileFilter)
    if (exception?.message === 'Somente arquivos PDF são permitidos.') {
      return response.status(400).json({
        statusCode: 400,
        message: 'Apenas arquivos PDF são aceitos.',
        error: 'Bad Request',
      });
    }

    // Outros erros Multer
    if (exception?.name === 'MulterError') {
      return response.status(400).json({
        statusCode: 400,
        message: 'Erro no envio do arquivo. Tente novamente.',
        error: 'Bad Request',
      });
    }

    // Erros de validação do NestJS (BadRequestException)
    if (exception instanceof BadRequestException) {
      return response.status(400).json(exception.getResponse());
    }

    // Qualquer outro erro → 500 padrão
    const status = exception?.status ?? 500;
    response.status(status).json({
      statusCode: status,
      message: exception?.message ?? 'Erro interno do servidor.',
      error: exception?.response?.error ?? 'Internal Server Error',
    });
  }
}
