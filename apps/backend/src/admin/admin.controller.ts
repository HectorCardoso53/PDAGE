import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './admin.guard';
import { UpdateEtapaDto } from './dto/update-etapa.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('candidatos')
  listCandidatos() {
    return this.adminService.listCandidatos();
  }

  @Patch('etapa/:id')
  updateEtapa(@Param('id') id: string, @Body() dto: UpdateEtapaDto, @Req() req: any) {
    return this.adminService.updateEtapa(id, dto, req.user);
  }

  @Delete('candidato/:id')
  deleteCandidato(@Param('id') id: string) {
    return this.adminService.deleteCandidato(id);
  }

  @Get('audit-logs')
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }

  @Get('membros')
  listMembros() {
    return this.adminService.listMembros();
  }

  @Post('membros')
  createMembro(@Body() dto: any, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.createMembro(dto);
  }

  @Patch('membros/:id/toggle')
  toggleMembro(@Param('id') id: string, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.toggleMembro(id);
  }

  @Patch('membros/:id/senha')
  resetSenhaMembro(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.resetSenhaMembro(id, body.novaSenha);
  }

  @Patch('membros/:id/permissao')
  updatePermissao(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.updatePermissao(id, body.permissao);
  }

  @Delete('membros/:id')
  deleteMembro(@Param('id') id: string, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.deleteMembro(id);
  }

  @Post('notificar/:id')
  notificarCandidato(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.notificarCandidato(id, body.assunto, body.mensagem);
  }

  @Post('notificar-sem-documentos')
  notificarSemDocumentos(@Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.notificarSemDocumentos();
  }

  private isMasterOrAdmin(user: any): boolean {
    return user?.role === 'admin' || (user?.role === 'comissao' && user?.permissao === 'MASTER');
  }
}
