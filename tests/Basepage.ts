import { Page, expect } from '@playwright/test';
import Axe from '@axe-core/playwright';
import path from 'path';
import fs from 'fs';

type NetworkCondition =
    | 'offline'
    | 'slow2g'
    | '2g'
    | '3g'
    | '4g'
    | 'wifi'
    | 'fast'
    | 'normal';

export class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async waitForPageLoad(startTime: number): Promise<void> {

    
        await this.page.waitForLoadState('networkidle');

        const endTime = Date.now();

        const durationMS = endTime - startTime;
        const durationSec = (durationMS / 1000).toFixed(2);

        console.log(`Page loaded in ${durationSec} seconds.`);
    }

    async waitForPageLoadPerformance(performanceTime: number): Promise<void> {

    
        await this.page.waitForLoadState('networkidle');

        const endTime = performance.now();

        const durationMS = endTime - performanceTime;
        const durationSec = (durationMS / 1000).toFixed(2);

        console.log(`Page loaded in ${durationSec} milliseconds.`);
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

    async emulateNetwork(condition: NetworkCondition): Promise<void> {

        const client = await this.page.context().newCDPSession(this.page);

        switch (condition) {
            case 'offline':
                await client.send('Network.emulateNetworkConditions', {
                offline: true,
                downloadThroughput: 0,
                uploadThroughput: 0,
                latency: 0,
            });
                break;
            
            case 'slow2g':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 250 * 1024 / 8,  // 250 Kbps
                    uploadThroughput: 50 * 1024 / 8,      // 50 Kbps
                    latency: 300,                          // 300ms
                });
                break;

            case '2g':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 450 * 1024 / 8,  
                    uploadThroughput: 150 * 1024 / 8,      
                    latency: 150,                          
                });
                break;

            case '3g':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 1.5 * 1024 * 1024 / 8,  
                    uploadThroughput: 750 * 1024 / 8,      
                    latency: 40,                          
                });
                break;

            case '4g':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 4 * 1024 * 1024 / 8,   // 4 Mbps
                    uploadThroughput: 3 * 1024 * 1024 / 8,      // 3 Mbps
                    latency: 20,                                  // 20ms
                });
                break;

            case 'wifi':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 30 * 1024 * 1024 / 8,  // 30 Mbps
                    uploadThroughput: 15 * 1024 * 1024 / 8,     // 15 Mbps
                    latency: 2,                                   // 2ms
                });
                break;

            case 'fast':
                await client.send('Network.emulateNetworkConditions', {
                    offline: false,
                    downloadThroughput: 100 * 1024 * 1024 / 8, // 100 Mbps
                    uploadThroughput: 100 * 1024 * 1024 / 8,    // 100 Mbps
                    latency: 0,                                   // 0ms
                });
                break;

            case 'normal':
                default:
                    await client.send('Network.emulateNetworkConditions', {
                        offline: false,
                        downloadThroughput: -1, // unlimited
                        uploadThroughput: -1,   // unlimited
                        latency: 0,             // no latency
                    });
                    break;
            
        }
    }
}