import { expect, test } from '@playwright/test';

const seededPassword = 'TestPass!234';

test('public storefront, legal pages, and protected redirects work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Master the markets. Trade with conviction.' })).toBeVisible();
  await expect(page.getByRole('link').filter({ hasText: 'Book 1' })).toBeVisible();
  await expect(page.getByRole('link').filter({ hasText: 'Book 2' })).toBeVisible();

  await page.goto('/books/book-2');
  await expect(page.getByRole('heading', { name: 'Book 2' })).toBeVisible();
  await expect(page.getByText('limited to 3 downloads per account')).toBeVisible();

  const checkoutResponse = await page.request.post('/api/checkout', {
    data: { slug: 'book-2' },
  });
  expect(checkoutResponse.status()).toBe(401);

  await page.goto('/library');
  await expect(page).toHaveURL(/\/auth\/sign-in\?redirect=%2Flibrary/);

  for (const path of ['/legal/terms', '/legal/privacy', '/legal/refunds']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('seeded admin can reach admin and member dashboards', async ({ page }) => {
  const response = await page.request.post('/api/auth/sign-in/email', {
    data: {
      email: 'admin@trading.test',
      password: seededPassword,
      callbackURL: '/admin',
    },
    headers: {
      origin: 'http://localhost:4173',
    },
  });

  expect(response.ok()).toBe(true);

  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();

  const expectedHeadings = new Map([
    ['/admin/products', 'Products'],
    ['/admin/customers', 'Customers'],
    ['/admin/purchases', 'Purchases'],
    ['/admin/audit-log', 'Audit log'],
    ['/account', 'Account'],
    ['/account/security', 'Active sessions'],
    ['/account/purchases', 'Purchases'],
    ['/library', 'Your library'],
  ]);

  for (const [path, heading] of expectedHeadings) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
  }
});
