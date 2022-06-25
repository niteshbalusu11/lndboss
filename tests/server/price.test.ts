import { expect, test } from '@playwright/test';

import { getPrices } from '@alexbosworth/fiat';
import request from 'balanceofsatoshis/commands/simple_request';

test.describe('Test Price command on the node.js side', async () => {
  test.beforeAll(async () => {
    // Do nothing
  });

  test('run Price command', async () => {
    const args = {
      symbols: 'USD,AUD',
      file: false,
      from: 'coindesk',
    };
    const result = await getPrices({
      request,
      symbols: ['USD', 'AUD'],
      from: args.from,
    });

    console.log('price----', result);
    expect(result.tickers).toBeTruthy();
  });

  test.afterAll(async () => {
    // Do nothing
  });
});
