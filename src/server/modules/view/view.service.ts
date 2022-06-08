/* eslint-disable import/no-duplicates */
import { Injectable, OnModuleInit } from '@nestjs/common';

import { NextServer } from 'next/dist/server/next';
import next from 'next';

@Injectable()
export class ViewService implements OnModuleInit {
  private server: NextServer;

  async onModuleInit(): Promise<void> {
    try {
      this.server = next({ dev: true, dir: './src/client' });
      await this.server.prepare();
    } catch (error) {
      console.log(error);
    }
  }

  getNextServer() {
    return this.server;
  }
}
