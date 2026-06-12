import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { test } from './index';

test('ScreenshotLogin Page for emulate mobile', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.takeMobileScreenshot('Login-Page');
    await page.close();
})



test('Login Page for emulate mobile', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.getFontSize();
    await mobileLoginPage.verifyTouchEnabled();
    await mobileLoginPage.verifyVisibleOnMobile();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.verifyNoHorizontalScroll();
    await page.close();
})

test('Verify Login Page viewport', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.verifyMobileViewport();
    await page.close();
})

test('Verify Inventory Page scrolldown and up', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.scrollDown();
    await mobileLoginPage.scrollUp();
    await page.close();
})

test('Verify Inventory Page custom value scrolldown and up', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.scrollDown(1000);
    await mobileLoginPage.scrollUp(600);
    await page.close();
})

test('Verify Inventory Page scroll to the bottom and top', async ({ mobileLoginPage, loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await mobileLoginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await mobileLoginPage.scrollToBottom();
    await mobileLoginPage.scrollToTop();
    //await page.close();
})

test('Verify Inventory Page Pixel ratio', async ({ mobileLoginPage, loginPage, page }) => {
    
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