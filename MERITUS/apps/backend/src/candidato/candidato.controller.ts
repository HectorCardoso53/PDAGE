import { Body, Controller, Get, Param, Patch, Request, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CandidatoService } from './candidato.service';

const DOC_FIELDS = [
  'docRg', 'docCpf', 'docResidencia', 'docTituloEleitor',
  'docQuitacao', 'docReservista', 'docDiploma', 'docPosGraduacao', 'docLotacao',
] as const;

@Controller('candidato')
export class CandidatoController {
  constructor(private candidatoService: CandidatoService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: { id: string } }) {
    return this.candidatoService.getMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @Request() req: { user: { id: string } },
    @Body() body: Record<string, string>,
  ) {
    return this.candidatoService.updateMe(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('etapa/:id/recurso')
  submeterRecurso(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { recurso: string },
  ) {
    return this.candidatoService.submeterRecurso(id, req.user.id, body.recurso);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('docs')
  @UseInterceptors(
    FileFieldsInterceptor(
      DOC_FIELDS.map(name => ({ name, maxCount: 1 })),
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req: any, file, cb) => {
            const cpf = (req.user?.cpf ?? 'desconhecido').replace(/\D/g, '');
            const ext = extname(file.originalname).toLowerCase();
            cb(null, `${cpf}_${file.fieldname}${ext}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (extname(file.originalname).toLowerCase() === '.pdf') {
            cb(null, true);
          } else {
            cb(new Error('Somente arquivos PDF são permitidos.'), false);
          }
        },
        limits: { fileSize: 20 * 1024 * 1024 },
      },
    ),
  )
  updateDocs(
    @Request() req: any,
    @UploadedFiles() files: Record<string, any[]>,
  ) {
    return this.candidatoService.updateDocs(req.user.id, files ?? {});
  }
}
