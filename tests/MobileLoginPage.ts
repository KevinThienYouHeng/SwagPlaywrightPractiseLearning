import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';
import { LoginPage } from './LoginPage';


export class MobileLoginPage extends BasePage {

    readonly title: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly errorCloseButton: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.getByText('Swag Labs');
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

    async verifyNoHorizontalScroll(): Promise<void> {
        const scrollWidth = await this.page.evaluate(
            () => document.documentElement.scrollWidth
        );
        const clientWidth = await this.page.evaluate(
            () => document.documentElement.clientWidth
        );
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    }

    async takeMobileScreenshot(name: string): Promise<void> {
        const viewport = this.page.viewportSize();
        const orientation = (viewport?.width ?? 0) > (viewport?.height ?? 0)
            ? 'landscape'
            : 'portrait';
        await this.takeScreenshot(
            `mobile/${name}-${orientation}.png`
        );
    }

    async login(username: string, password: string) : Promise<void> {
        const startTime = Date.now();
        await this.username.tap();
        await this.username.fill(username);
        await this.password.tap();
        await this.password.fill(password);
        await expect(this.username).not.toBeEmpty();
        await expect(this.password).not.toBeEmpty();
        await this.loginButton.tap();
        await this.waitForPageLoad(startTime); 
    }

    async verifyVisibleOnMobile(): Promise<void> {
        await expect(this.title).toBeVisible();
        await expect(this.username).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginButton).toBeVisible();
        
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

    async getFontSize(): Promise<void> {

        const fontSize1 = await this.title.evaluate(el => {
        return parseFloat(window.getComputedStyle(el).fontSize);
        });
        console.log(`Font size: ${fontSize1}px`);

        const fontSize2 = await this.loginButton.evaluate(el => {
        return parseFloat(window.getComputedStyle(el).fontSize);
        });
        console.log(`Font size: ${fontSize2}px`);

        const fontSize3 = await this.username.evaluate(el => {
        return parseFloat(window.getComputedStyle(el).fontSize);
        });
        console.log(`Font size: ${fontSize3}px`);

        const fontSize4 = await this.loginButton.evaluate(el => {
        return parseFloat(window.getComputedStyle(el).fontSize);
        });
        console.log(`Font size: ${fontSize4}px`);
        
    }
    
}
