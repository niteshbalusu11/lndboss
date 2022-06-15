import { SetMetadata } from '@nestjs/common';
import { randomBytes } from 'crypto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secret: '123456' || randomBytes(64).toString('hex'),
};
