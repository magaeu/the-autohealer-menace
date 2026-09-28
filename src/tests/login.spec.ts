import { test, expect } from '@fixtures/login';


test.describe('Log in', () => {

  test('log in with valid credentials', async ({ page, loginPage }) => {

    await loginPage.login('practice', 'SuperSecretPassword!');

    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
  });
});
