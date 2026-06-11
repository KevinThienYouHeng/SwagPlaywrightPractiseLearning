import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { test } from './index';



test('Login Page for emulate mobile', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.verifyTouchEnabled();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

test('Verify Login Page viewport', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.verifyMobileViewport();
    await page.close();
})

test('Verify Login Page scrolldown and up', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.scrollDown(400);
    await mobileLoginPage.scrollUp(500);
    await page.close();
})

test('Verify Login Page scroll to the bottom and top', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.scrollToBottom();
    await mobileLoginPage.scrollToTop();
    //await page.close();
})

test('Verify Login Page Pixel ratio', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.getDevicePixelRatio();
    //await page.close();
})

test('Set mobile to landscape', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.setLandscape();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await mobileLoginPage.setPortrait();
    //await page.close();
})