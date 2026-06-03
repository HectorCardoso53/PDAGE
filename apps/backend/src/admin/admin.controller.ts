import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
  updateEtapa(@Param('id') id: string, @Body() dto: UpdateEtapaDto) {
    return this.adminService.updateEtapa(id, dto);
  }

  @Delete('candidato/:id')
  deleteCandidato(@Param('id') id: string) {
    return this.adminService.deleteCandidato(id);
  }
}
