import { Page, expect } from '@playwright/test';
import Axe from '@axe-core/playwright';
import path from 'path';
import fs from 'fs';

export class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async waitForPageLoad(): Promise<void> {

        const startTime = Date.now();

        await this.page.waitForLoadState('networkidle');

        const endTime = Date.now();

        const durationMS = endTime - startTime;
        const durationSec = (durationMS / 1000).toFixed(2);

        console.log(`Page loaded in ${durationSec} seconds.`);
    }

    async measureEndpointPerformance(): Promise<void> {
        const startTime = performance.now();
  
       await this.page.waitForLoadState('networkidle');
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`API Navigation response took: ${duration.toFixed(2)}ms`);
        expect(duration).toBeLessThan(3000);
    }

    async takeScreenshot(fileName: string): Promise<void> {

        const screenshotsDir = path.join(process.cwd(), 'screenshots');

        if(!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive:true});
        }

        const filePath = path.join(screenshotsDir, fileName);

        await this.page.screenshot({ path: filePath, fullPage: true });
    }

    protected async runAccessibilityCheck(): Promise<void> {
        const axe = await new Axe({ page: this.page }).analyze();
        console.log('Accessibility Violations:', axe.violations);
    }

    async validatePageIsReachable(url: string): Promise<void> {
        const response = await this.page.request.get(url);
        expect(response.status()).toBe(200);
        console.log(`✅ ${url} is reachable!`);
    }

    async routeApiSetup(): Promise<void> {
        await this.page.route('**/*', async route => {
            const url = route.request().url();
            const method = route.request().method();
            
            console.log(`📮 Request: ${method} → ${url}`);
            await route.continue(); 
        });
    }

    async interceptLoginState(): Promise<void> {
        const localStorage = await this.page.evaluate(() => {
        return {
            username: window.localStorage.getItem('session-username'),
            cartContents: window.localStorage.getItem('cart-contents'),
        };
    });
        console.log(`   Username      : ${localStorage.username}`);
        console.log(`   Cart Contents : ${localStorage.cartContents}`);

    }

    async checkStatusURL(): Promise<void> {
        const response = await this.page.request.get('https://www.saucedemo.com/');
        try {
            expect(response.status()).toBe(200);
            console.log('Web page is up and running');
        }catch{
            console.log('Web page is not reachable');
        }
        
    }

    async longLine(): Promise<void> {
        console.log('--------------------------------------------------');
    }

    async loadPerformanceMetrics(): Promise<void> {

        const performanceTimings = await this.page.evaluate(() => {
        const [timing] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        return {
            domReady: timing.domContentLoadedEventEnd - timing.startTime,
            loadTime: timing.loadEventEnd - timing.startTime,
        };
        });
        console.log(`DOM Ready: ${performanceTimings.domReady}ms`);
        console.log(`Load Time: ${performanceTimings.loadTime}ms`);

        expect(performanceTimings.loadTime).toBeLessThan(2000);
    }
}