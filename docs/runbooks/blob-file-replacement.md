# Blob File Replacement

Product PDFs are stored as private Vercel Blob objects.

1. Admin uploads a replacement PDF.
2. App writes the file to `books/<slug>.pdf`.
3. Product row keeps the current Blob pathname.
4. Existing customers receive the new file on their next authorized download.

