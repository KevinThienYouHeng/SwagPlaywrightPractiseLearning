import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

//Class is like a blueprint for creating objects and defines what the loginpage has and can do include properties and methods
export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    //readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async goToLoginPage() : Promise<void> {
        //await this.page.goto('https://www.saucedemo.com/inventory.html');
        await this.page.goto('https://www.saucedemo.com/');
        //await this.runAccessibilityCheck(); 
        await this.waitForPageLoad();
        await this.takeScreenshot('login-page.png');
    }

    async login(username: string, password: string) : Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.waitForPageLoad(); // From BasePage
    }

    //Message must be exactly the same if not the test will fail
    //For future, maybe we can make it more flexible way to verify the error message
    async verifyErroMessage(expectedMessage: string): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(expectedMessage);
        console.log(`Error message verifired: ${expectedMessage}`);
    }

    async verifyLoginSuccess(): Promise<void> {
        await expect(this.page).toHaveURL(/.*inventory.html/);
        console.log('Login successful, max verstappen');
    }

}