import { Controller, Get, Query } from '@nestjs/common';
import { priceDto } from '~shared/commands.dto';
import { PriceService } from './price.service';

// Price controller: Handles routes to the price service

@Controller('api/price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Get()
  async price(@Query() args: priceDto) {
    return this.priceService.get(args);
  }
}
