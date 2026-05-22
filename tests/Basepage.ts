import { Page } from '@playwright/test';
import Axe from '@axe-core/playwright';

export class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    protected async waitForPageLoad(): Promise<void> {

        const startTime = Date.now();

        await this.page.waitForLoadState('networkidle');

        const endTime = Date.now();

        const durationMS = endTime - startTime;
        const durationSec = (durationMS / 1000).toFixed(2);

        console.log(`Page loaded in ${durationSec} seconds.`);
    }

    async takeScreenshot(fileName: string): Promise<void> {
        await this.page.screenshot({ path: fileName });
    }

    protected async runAccessibilityCheck(): Promise<void> {
        const axe = await new Axe({ page: this.page }).analyze();
        console.log('Accessibility Violations:', axe.violations);
    }
}