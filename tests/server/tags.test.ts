import { expect, test } from '@playwright/test';
import tagsCommand from '../../main/commands/tags/tags_command';

type Args = {
  add: string[];
  id?: string;
  tag?: string;
  remove: string[];
  is_avoided?: boolean;
  icon?: string;
};

test.describe('Test Tags command on the node.js side', async () => {
  test.beforeAll(async () => {
    // Nothing to do
  });

  test('run tags command, add a tag', async () => {
    const args: Args = {
      add: [
        '034f10e9540d56502bd29e03b3d1536b798e723adcfbd43932f2313d282eb15d6f',
        '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb',
      ],
      remove: [],
      tag: 'testtag',
      icon: '❤️',
      is_avoided: true,
    };
    const { result, error } = await tagsCommand(args);
    console.log(result);
    expect(result).toBeTruthy();
    expect(error).toBe(undefined);
  });

  test('run tags command, print all tags', async () => {
    const args = {
      add: [],
      remove: [],
    };
    const { result, error } = await tagsCommand(args);
    console.log(result);
    expect(error).toBe(undefined);
    expect(result).toBeTruthy();
  });

  test('run tags command, remove tag', async () => {
    const args = {
      add: [],
      remove: [
        '034f10e9540d56502bd29e03b3d1536b798e723adcfbd43932f2313d282eb15d6f',
        '021b0ea06c90e7e4ea85daff1a83f7a1b97646da652829178ad1bd5f309af632eb',
      ],
      tag: 'testtag',
    };
    const { result, error } = await tagsCommand(args);
    console.log(result);
    expect(error).toBe(undefined);
    expect(result).toBeTruthy();
  });

  test.afterAll(async () => {
    // Nothing to do
  });
});
