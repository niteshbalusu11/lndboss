import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

// Users Module: Module for the users service

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
