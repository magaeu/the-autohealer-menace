import { test, expect } from '@fixtures/login';


test.describe('Log in', () => {

  test('log in with valid credentials', async ({ page, loginPage }) => {

    await loginPage.fillUserName('practice');
    await loginPage.fillPassword('SuperSecretPassword!');
    await loginPage.clickLogin();

    await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
  });
});
