import { Body, Controller, Post, HttpCode, HttpStatus, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { InscricaoService } from './inscricao.service';
import { CriarInscricaoDto } from './dto/criar-inscricao.dto';

const DOC_FIELDS = [
  'docRgCnh', 'docCpf', 'docResidencia', 'docTituloEleitor',
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
          const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
          if (allowed.includes(extname(file.originalname).toLowerCase())) {
            cb(null, true);
          } else {
            cb(new Error('Somente PDF, JPG ou PNG são permitidos.'), false);
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
