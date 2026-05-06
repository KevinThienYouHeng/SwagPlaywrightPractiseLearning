import { Page, Locator } from '@playwright/test';
import { BasePage } from './Basepage';

//Class is like a blueprint for creating objects and defines what the loginpage has and can do include properties and methods
export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    //readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
    }

    async goToLoginPage() : Promise<void> {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
        await this.waitForPageLoad();
    }

    async login(username: string, password: string) : Promise<void> {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.waitForPageLoad(); // From BasePage
    }

}