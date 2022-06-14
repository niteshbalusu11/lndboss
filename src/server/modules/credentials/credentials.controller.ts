import { Body, Controller, Post } from '@nestjs/common';
import { credentialsDto } from '~shared/commands.dto';
import { CredentialsService } from './credentials.service';

// Credentials Controller: Handles routes to the credentials service

@Controller('api/credentials')
export class CredentialsController {
  constructor(private credentialsService: CredentialsService) {}

  @Post()
  async credentials(@Body() args: credentialsDto) {
    return await this.credentialsService.post(args);
  }
}
