import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password';

describe('password hashing', () => {
  it('verifies the original password and rejects another value', async () => {
    const hash = await hashPassword('TestPass!234');

    await expect(verifyPassword({ password: 'TestPass!234', hash })).resolves.toBe(true);
    await expect(verifyPassword({ password: 'wrong-password', hash })).resolves.toBe(false);
  });
});

