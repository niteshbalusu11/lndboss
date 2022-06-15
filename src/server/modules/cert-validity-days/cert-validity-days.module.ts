import { CertValidityDaysController } from './cert-validity-days.controller';
import { CertValidityDaysService } from './cert-validity-days.service';
import { Module } from '@nestjs/common';

// CertValidityDays Module: Module for certValidityDays command

@Module({
  controllers: [CertValidityDaysController],
  providers: [CertValidityDaysService],
})
export class CertValidityDaysModule {}
