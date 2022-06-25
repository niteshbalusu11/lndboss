import { Module } from '@nestjs/common';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

// Price Module: Module for the price command

@Module({
  controllers: [PriceController],
  providers: [PriceService],
})
export class PriceModule {}
