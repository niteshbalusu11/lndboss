import { Body, Controller, Post } from '@nestjs/common';
import { credentialsDto } from '~shared/commands.dto';
import { CredentialsService } from './credentials.service';

@Controller('api/credentials')
export class CredentialsController {
  constructor(private loginService: CredentialsService) {}

  @Post()
  async login(@Body() args: credentialsDto) {
    return this.loginService.post(args);
  }
}
