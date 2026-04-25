import { del, get, put } from '@vercel/blob';

import { NotFoundError } from '$lib/server/errors';

export async function uploadProductFile(
  pathname: string,
  body: Buffer | ReadableStream,
  contentType: string,
): Promise<{ pathname: string; url: string }> {
  const blob = await put(pathname, body, {
    access: 'private',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return {
    pathname: blob.pathname,
    url: blob.url,
  };
}

export async function getPrivateBlob(pathname: string): Promise<{
  body: ReadableStream;
  contentType: string;
  contentLength: number | null;
}> {
  const result = await get(pathname, { access: 'private', useCache: false });

  if (!result?.stream) {
    throw new NotFoundError('File not found.');
  }

  return {
    body: result.stream,
    contentType: result.blob.contentType || 'application/octet-stream',
    contentLength: result.blob.size ?? null,
  };
}

export async function deleteProductFile(pathname: string): Promise<void> {
  await del(pathname);
}
