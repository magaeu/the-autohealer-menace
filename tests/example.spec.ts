import { test, expect } from '@playwright/test';

test('log in with valid credentials', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/login');

  await page.getByTestId('username').fill('practice');
  await page.getByTestId('passwords').fill('SuperSecretPassword!');
  await page.getByTestId('submit-login').click();

  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
});
