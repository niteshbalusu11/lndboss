import { expect, test } from '@playwright/test';
import { lndCredentials, putSavedCredentials } from '../../src/server/lnd';

test.describe('Test authentication from node.js side', async () => {
  const lightning = {
    cert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNJakNDQWNpZ0F3SUJBZ0lSQVBDdnFFL0h0Y2RVeFpRRm8vcFpWeG93Q2dZSUtvWkl6ajBFQXdJd01ERWYKTUIwR0ExVUVDaE1XYkc1a0lHRjFkRzluWlc1bGNtRjBaV1FnWTJWeWRERU5NQXNHQTFVRUF4TUVaR0YyWlRBZQpGdzB5TWpBMU1qa3hOVFEyTlRCYUZ3MHlNekEzTWpReE5UUTJOVEJhTURBeEh6QWRCZ05WQkFvVEZteHVaQ0JoCmRYUnZaMlZ1WlhKaGRHVmtJR05sY25ReERUQUxCZ05WQkFNVEJHUmhkbVV3V1RBVEJnY3Foa2pPUFFJQkJnZ3EKaGtqT1BRTUJCd05DQUFROTc3ZU0rRjhYemJLYjFCbEhhOE1DWjhra1k5R0hUL2lMamF1OUc1T00yRUhZQzRPQwplZDBXcjY3OWtEY2NLYzVuVHYwOE9ZaXZPSGJpYmlpSzhsazlvNEhDTUlHL01BNEdBMVVkRHdFQi93UUVBd0lDCnBEQVRCZ05WSFNVRUREQUtCZ2dyQmdFRkJRY0RBVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVcKQkJTb1NSVy9GWTJ0a1FFVnEvMzdETTFZS04vVnVUQm9CZ05WSFJFRVlUQmZnZ1JrWVhabGdnbHNiMk5oYkdodgpjM1NDQkdSaGRtV0NEWEJ2YkdGeUxXNHhMV1JoZG1XQ0JIVnVhWGlDQ25WdWFYaHdZV05yWlhTQ0IySjFabU52CmJtNkhCSDhBQUFHSEVBQUFBQUFBQUFBQUFBQUFBQUFBQUFHSEJLd1VBQVl3Q2dZSUtvWkl6ajBFQXdJRFNBQXcKUlFJaEFKTFArOU52V2hMOEUreFNnK2R4M00xa0ZML2hoazEwdnd5MTVHaDcwWFNzQWlCNVB5MlhRV29sRHp5aApYdjdhSk5jRnV3N1RjcnRmZTVGdFhoNWVFa1Q0OHc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==',
    macaroon:
      'AgEDbG5kAvgBAwoQ1mg/Cq38WkO1lmkurqpL5RIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgsnPf+6jeF4gtMKxr1DtOl/FzB5JL7BWWdHtbXgyV75w=',
    socket: '127.0.0.1:10004',
  };

  test.beforeAll(async () => {
    // Do nothing
  });

  test('add a new saved node credential', async () => {
    const node = 'playwrightservertestcredential';
    const { result } = await putSavedCredentials({
      auth_type: 'credentials',
      cert: lightning.cert,
      macaroon: lightning.macaroon,
      socket: lightning.socket,
      node,
      is_default: false,
    });

    expect(result).toBeTruthy();
    console.log(`credentials----${result}`);
  });

  test('get saved node credential', async () => {
    const node = 'testnode1';
    const { macaroon, socket } = await lndCredentials({ node });

    expect(macaroon).toBeTruthy();
    expect(socket).toBeTruthy();
    console.log(`credentials----${macaroon} ${socket}`);
  });

  test.afterAll(async () => {
    // Do nothing
  });
});
