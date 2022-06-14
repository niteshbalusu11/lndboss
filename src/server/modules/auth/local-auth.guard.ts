import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Add a local auth guard to check if the user is logged in before returning a JWT

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
