import type { RequestEvent } from './$types';

import { handleApiError } from '$lib/server/http';
import { getPrivateBlob } from '$lib/server/storage/blob';
import { verifyDownloadToken } from '$lib/server/storage/download-token';

export async function GET(event: RequestEvent): Promise<Response> {
  try {
    const token = event.url.searchParams.get('token');

    if (!token) {
      return new Response('Missing token.', { status: 400 });
    }

    const payload = verifyDownloadToken(token);
    const blob = await getPrivateBlob(payload.pathname);
    const headers = new Headers({
      'Content-Type': blob.contentType,
      'Content-Disposition': `attachment; filename="${event.params.slug}.pdf"`,
      'Cache-Control': 'private, no-store',
    });

    if (blob.contentLength !== null) {
      headers.set('Content-Length', blob.contentLength.toString());
    }

    return new Response(blob.body, { headers });
  } catch (error) {
    return handleApiError(error);
  }
}
