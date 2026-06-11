import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';
import { LoginPage } from './LoginPage';


export class MobileLoginPage extends BasePage {

    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly errorCloseButton: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorCloseButton = page.locator('[data-test="error-button"]');
    }

    async verifyTouchEnabled(): Promise<void> {
        const hasTouch = await this.page.evaluate(
            () => 'ontouchstart' in window
        );
        expect(hasTouch).toBe(true);
        console.log(`Touch enabled: ${hasTouch}`);
    }

    async login(username: string, password: string) : Promise<void> {
        const startTime = Date.now();
        await this.username.tap();
        await this.username.fill(username);
        await this.password.tap();
        await this.password.fill(password);
        await this.loginButton.tap();
        await this.waitForPageLoad(startTime); 
    }

    async verifyMobileViewport(): Promise<void> {
        const viewport = this.page.viewportSize();
        expect(viewport?.width).toBeLessThanOrEqual(768);
        console.log(`Viewport: ${viewport?.width}x${viewport?.height}`);
    }

    async scrollDown(pixels: number = 300): Promise<void> {
        await this.page.evaluate((px) => {
            window.scrollBy(0, px);
        }, pixels);
        console.log(`Scrolled down ${pixels}px`);
    }

    async scrollUp(pixels: number = 300): Promise<void> {
        await this.page.evaluate((px) => {
            window.scrollBy(0, -px);
        }, pixels);
        console.log(`Scrolled up ${pixels}px`);
    }

    async scrollToTop(): Promise<void> {
        await this.page.evaluate(() => {
            window.scrollTo(0, 0);
        })
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        })
    }

    async getDevicePixelRatio(): Promise<number> {
        const ratio = await this.page.evaluate(() => window.devicePixelRatio);
        console.log(`Pixel ratio ${ratio}`);
        return ratio;
    }

    async setLandscape(): Promise<void> {
        const viewport = this.page.viewportSize();
        const width = Math.max(viewport?.width ?? 390, viewport?.height ?? 844);
        const height = Math.min(viewport?.width ?? 390, viewport?.height ?? 844);
        await this.page.setViewportSize({ width, height });
        console.log(`Landscape: ${width}x${height}`);
    }

    async setPortrait(): Promise<void> {
        const viewport = this.page.viewportSize();
        const width = Math.min(viewport?.width ?? 390, viewport?.height ?? 844);
        const height = Math.max(viewport?.width ?? 390, viewport?.height ?? 844);
        await this.page.setViewportSize({ width, height });
        console.log(`Portrait: ${width}x${height}`);
    }
    
}
