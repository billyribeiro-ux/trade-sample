import { describe, expect, it } from 'vitest';

import { createDownloadToken, verifyDownloadToken } from './download-token';

describe('download tokens', () => {
  it('round-trips a valid token', () => {
    const payload = {
      userId: 'user-1',
      productId: 'product-1',
      entitlementId: 'entitlement-1',
      pathname: 'books/book-1.pdf',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    };

    const token = createDownloadToken(payload);

    expect(verifyDownloadToken(token)).toEqual(payload);
  });

  it('rejects expired tokens', () => {
    const token = createDownloadToken({
      userId: 'user-1',
      productId: 'product-1',
      entitlementId: 'entitlement-1',
      pathname: 'books/book-1.pdf',
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    });

    expect(() => verifyDownloadToken(token)).toThrow('Download link expired.');
  });
});

