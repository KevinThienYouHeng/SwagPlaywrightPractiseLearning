// e2e/step-definitions/login.steps.ts
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SwagWorld } from '../support/world';

// Adjust the import path based on where your POMs live
import { LoginPage } from '../../tests/LoginPage';

Given('I am on the login page', async function (this: SwagWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goToLoginPageOnlyUrl();
});

When('I enter username {string}', async function (this: SwagWorld, username: string) {
    await this.page.locator('[data-test="username"]').fill(username);
    //await this.page.fill('#user-name', username);
});

When('I enter password {string}', async function (this: SwagWorld, password: string) {
  await this.page.locator('[data-test="password"]').fill(password);
});

// When('I leave the password field empty {string}', async function (this: SwagWorld, password: string) {
//   await this.page.locator('[data-test="password"]').fill(password);
// });

When('I click the login button', async function (this: SwagWorld) {
  await this.page.locator('[data-test="login-button"]').click();
});

Then('I should see the inventory page', async function (this: SwagWorld) {
  await expect(this.page).toHaveURL(/.*inventory.html/);
});

Then('I should see an error message {string}', async function (this: SwagWorld, expectedMessage: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.verifyErroMessage(expectedMessage);
});