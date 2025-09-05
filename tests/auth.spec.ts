import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form by default', async ({ page }) => {
    await page.goto('/auth');
    
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should switch to registration form', async ({ page }) => {
    await page.goto('/auth');
    
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    await expect(page.getByText('Join FitTrack')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });
});