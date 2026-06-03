import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CandidatoService } from './candidato.service';

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
}
