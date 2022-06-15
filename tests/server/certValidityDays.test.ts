import { expect, test } from '@playwright/test';

import { certValidityDaysCommand } from '../../src/server/commands/';

test.describe('Test CertValidityDays command on the node.js side', async () => {
  test.beforeAll(async () => {
    // Do nothing
  });

  test('run ChainDeposit command', async () => {
    const args = {
      below: 1000,
      node: 'testnode1',
    };

    const { result } = await certValidityDaysCommand({ below: args.below, node: args.node });
    console.log('certValidityDays----', result);

    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    // Do nothing
  });
});
