import { expect, test as setup } from '@playwright/test';
import { LoginPage } from '../page-objects/page/login.page';

setup('Authorize', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.visit();
  await loginPage.logIn();

  await page.context().storageState({ path: './auth/defaultStorageState.json' });
});

