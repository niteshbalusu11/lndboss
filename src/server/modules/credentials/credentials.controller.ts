import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '~server/utils/constants';
import { credentialsDto } from '~shared/commands.dto';
import { CredentialsService } from './credentials.service';

// Credentials Controller: Handles routes to the credentials service

@Controller('api/credentials')
export class CredentialsController {
  constructor(private credentialsService: CredentialsService) {}

  @Public()
  @Post()
  async credentials(@Body() args: credentialsDto) {
    return this.credentialsService.post(args);
  }
}
