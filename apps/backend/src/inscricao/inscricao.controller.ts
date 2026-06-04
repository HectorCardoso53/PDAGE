import { Body, Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InscricaoService } from './inscricao.service';
import { CriarInscricaoDto } from './dto/criar-inscricao.dto';

const DOC_FIELDS = [
  'docRg', 'docCpf', 'docResidencia', 'docTituloEleitor',
  'docQuitacao', 'docReservista', 'docDiploma', 'docPosGraduacao', 'docLotacao',
] as const;

@Controller('inscricao')
export class InscricaoController {
  constructor(private inscricaoService: InscricaoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      DOC_FIELDS.map(name => ({ name, maxCount: 1 })),
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads'),
          filename: (req, file, cb) => {
            const cpf = (req.body?.cpf ?? 'desconhecido').replace(/\D/g, '');
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
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  criar(
    @Body() dto: CriarInscricaoDto,
    @UploadedFiles() files: Record<string, any[]>,
  ) {
    return this.inscricaoService.criar(dto, files ?? {});
  }
}
