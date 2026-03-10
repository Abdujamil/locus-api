import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocusService } from './locus.service';
import { GetLocusDto } from './dto/get-locus.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Locus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get locus list with filtering, sorting, pagination, and optional sideloading',
  })
  async getLoci(@Query() query: GetLocusDto, @Request() req: any) {
    return this.locusService.getLoci(query, req.user);
  }
}
