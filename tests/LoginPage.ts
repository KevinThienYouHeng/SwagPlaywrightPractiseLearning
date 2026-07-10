import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

//Class is like a blueprint for creating objects and defines what the loginpage has and can do include properties and methods
export class LoginPage extends BasePage {
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly errorCloseButton: Locator;
    //readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorCloseButton = page.locator('[data-test="error-button"]');
    }

    async goToLoginPageOnlyUrl() : Promise<void> {
        
        await this.navigate('https://www.saucedemo.com/');

    }
    async goToLoginPage() : Promise<void> {
        
        const startTime = Date.now();

        await this.navigate('https://www.saucedemo.com/');

        await this.waitForPageLoad(startTime);
        //await this.takeScreenshot('login-page.png');
    }

    async goToLoginPagePerformance() : Promise<void> {
        
        const performanceTime = performance.now();

        await this.navigate('https://www.saucedemo.com/');

        await this.waitForPageLoadPerformance(performanceTime);
        //await this.takeScreenshot('login-page.png');
    }

    async goToLoginPageEndPoint() : Promise<void> {
        
        await this.navigate('https://www.saucedemo.com/'); 
        await this.measureEndpointPerformance();
        //await this.takeScreenshot('login-page.png');
    }

    async visualLoginPageCheck(): Promise<void>{
        await this.goToLoginPage();
        await expect(this.page).toHaveScreenshot('login-page.png');
    }

    async login(username: string, password: string) : Promise<void> {
        const startTime = Date.now();
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.waitForPageLoad(startTime); // From BasePage
    }

    //This function is call injection
    async fastlogin(username: string, password: string) : Promise<void> {
        const startTime = Date.now();
        
        await this.username.evaluate((el: HTMLInputElement, val) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(el, val);
        } else {
            el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        }, username);

        // 2. Inject Password using React-safe native setter
        await this.password.evaluate((el: HTMLInputElement, val) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(el, val);
        } else {
            el.value = val;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        }, password);
                            
        await this.loginButton.click();
        await this.waitForPageLoad(startTime);
    }
    

    //Message must be exactly the same if not the test will fail
    //For future, maybe we can make it more flexible way to verify the error message
    async verifyErroMessage(expectedMessage: string): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(expectedMessage);
        console.log(`Error message verifired: ${expectedMessage}`);
        await this.errorCloseButton.click();
    }

    async verifyLoginSuccess(): Promise<void> {
        await expect(this.page).toHaveURL(/.*inventory.html/, {timeout: 5000});
        console.log('Login successful, max verstappen');
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async verifyLoginPage(): Promise<void> {

        await expect(this.page).toHaveTitle('Swag Labs');
        await expect(this.username).toBeVisible();
        await expect(this.username).toHaveAttribute('placeholder', 'Username');
        await expect(this.password).toBeVisible();
        await expect(this.password).toHaveAttribute('placeholder', 'Password');
        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toContainText('Login');
    }

    


}