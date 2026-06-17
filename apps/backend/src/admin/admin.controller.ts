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

  @Get('locks')
  getLocks() {
    return this.adminService.getLocks();
  }

  @Post('candidato/:id/lock')
  acquireLock(@Param('id') id: string, @Req() req: any) {
    return this.adminService.acquireLock(id, req.user);
  }

  @Delete('candidato/:id/lock')
  releaseLock(@Param('id') id: string, @Req() req: any) {
    return this.adminService.releaseLock(id, req.user.sub);
  }

  @Patch('candidato/:id/lock')
  refreshLock(@Param('id') id: string, @Req() req: any) {
    return this.adminService.refreshLock(id, req.user.sub);
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

  @Get('homologacao/publicacoes')
  getPublicacoes() {
    return this.adminService.getPublicacoes();
  }

  @Get('homologacao/status')
  getHomologacaoStatus() {
    return this.adminService.getHomologacaoStatus();
  }

  @Post('homologacao/publicar')
  publicarHomologacao(@Req() req: any, @Body() body: { linkDiario?: string; candidatoIds?: string[]; titulo?: string }) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.publicarHomologacao(body?.linkDiario, body?.candidatoIds, body?.titulo);
  }

  @Post('homologacao/despublicar')
  despublicarHomologacao(@Req() req: any) {
    if (!this.isMasterOrAdmin(req.user)) throw new ForbiddenException('Acesso restrito.');
    return this.adminService.despublicarHomologacao();
  }

  private isMasterOrAdmin(user: any): boolean {
    return user?.role === 'admin' || (user?.role === 'comissao' && user?.permissao === 'MASTER');
  }
}
