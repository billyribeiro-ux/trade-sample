import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

import { PermissionError } from '$lib/server/errors';

type DownloadTokenPayload = {
  userId: string;
  productId: string;
  entitlementId: string;
  pathname: string;
  expiresAt: string;
};

function getSecret(): string {
  return env.DOWNLOAD_SIGNING_SECRET || env.BETTER_AUTH_SECRET || 'local-download-signing-secret';
}

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createDownloadToken(payload: DownloadTokenPayload): string {
  const body = encode(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifyDownloadToken(token: string): DownloadTokenPayload {
  const [body, signature] = token.split('.');

  if (!body || !signature) {
    throw new PermissionError('Invalid download token.');
  }

  const expected = sign(body);

  if (
    expected.length !== signature.length ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    throw new PermissionError('Invalid download token.');
  }

  const payload = JSON.parse(decode(body)) as DownloadTokenPayload;

  if (Number.isNaN(Date.parse(payload.expiresAt)) || new Date(payload.expiresAt) <= new Date()) {
    throw new PermissionError('Download link expired.');
  }

  return payload;
}
