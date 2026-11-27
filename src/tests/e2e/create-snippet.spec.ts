import { expect, test } from '@playwright/test';

test('allows an authenticated user to publish a snippet', async ({ page }) => {
  const uniqueId = Date.now();
  const username = `e2euser${uniqueId}`;
  const email = `e2e-${uniqueId}@example.com`;
  const password = 'Password1';

  await page.goto('/register');

  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.getByRole('button', { name: 'Crear cuenta' }).click();

  await expect(page).toHaveURL(/\/home/);

  await page
    .getByRole('button', { exact: true, name: 'Publicar' })
    .first()
    .click();

  const publishModal = page.locator('.fixed.inset-0');

  await expect(
    publishModal.getByRole('heading', { name: 'Publicar' }),
  ).toBeVisible();

  await publishModal
    .getByRole('button', { exact: true, name: 'snippet' })
    .click();

  await publishModal
    .getByPlaceholder('¿Qué quieres compartir con el equipo?')
    .fill('E2E snippet test');

  await publishModal
    .getByPlaceholder(
      'Contexto: qué intentaste, qué medía, qué querés que revisen. Markdown permitido.',
    )
    .fill('Snippet creado mediante una prueba E2E.');

  await publishModal.getByPlaceholder('lenguaje: rust').fill('typescript');

  await publishModal
    .getByPlaceholder('// pega tu código acá')
    .fill('const e2eValue = 42;');

  await publishModal
    .getByRole('button', { exact: true, name: 'Publicar' })
    .click();

  await expect(publishModal).toHaveCount(0);

  await page.reload();

  const createdPost = page
    .locator('a')
    .filter({ hasText: 'const e2eValue = 42;' })
    .first();

  await expect(createdPost).toBeVisible();

  await expect(
    createdPost.getByText('Snippet creado mediante una prueba E2E.'),
  ).toBeVisible();

  await expect(createdPost.getByText('const e2eValue = 42;')).toBeVisible();

  await expect(
    createdPost.getByText('typescript', { exact: true }),
  ).toBeVisible();
});
