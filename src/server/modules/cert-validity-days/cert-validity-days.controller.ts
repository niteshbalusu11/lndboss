import { Controller, Get, Query } from '@nestjs/common';
import { certValidityDaysDto } from '~shared/commands.dto';
import { CertValidityDaysService } from './cert-validity-days.service';

// CertValidityDays Controller: Defines routes for certValidityDays command

@Controller('api/cert-validity-days')
export class CertValidityDaysController {
  constructor(private certValidityDaysService: CertValidityDaysService) {}

  @Get()
  async certValidityDays(@Query() args: certValidityDaysDto) {
    return this.certValidityDaysService.get(args);
  }
}
