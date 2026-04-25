import { describe, expect, it } from 'vitest';

import { resolveDownloadsAllowed } from './entitlements';

describe('resolveDownloadsAllowed', () => {
  it('keeps unlimited grants unlimited by default', () => {
    expect(resolveDownloadsAllowed({ downloadPolicy: 'unlimited', downloadLimit: null })).toBeNull();
  });

  it('uses capped product limits by default', () => {
    expect(resolveDownloadsAllowed({ downloadPolicy: 'capped', downloadLimit: 3 })).toBe(3);
  });

  it('allows admins to override grant download counts', () => {
    expect(resolveDownloadsAllowed({ downloadPolicy: 'capped', downloadLimit: 3 }, 7)).toBe(7);
  });
});
