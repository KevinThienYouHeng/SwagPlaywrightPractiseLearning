import cron from 'node-cron';
import { chromium } from '@playwright/test';
import {  LoginPage } from '../tests/LoginPage';

console.log('─────────────────────────────');
console.log(`▶️  Started at: ${new Date().toLocaleTimeString()}`);
console.log('─────────────────────────────');

// ✅ Runs every minute
cron.schedule('* * * * *', () => {
    const now = new Date();
    console.log(`⏰ Task ran at: ${now.toLocaleTimeString()}`);
    console.log('─────────────────────────────');
});

cron.schedule('*/3 * * * *', async () => {
    console.log('🌐 Checking website status...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    //const loginPage = new LoginPage(page);

    try {
        const response = await page.goto('https://www.saucedemo.com');
        const status = response?.status();

        if (status === 200) {
            console.log(`✅ Website is UP! Status: ${status}`);
        } else {
            console.log(`⚠️ Website issue! Status: ${status}`);
        }

    } catch (error) {
        console.log(`❌ Website is DOWN! ${error}`);
    } finally {
        await browser.close();
    }

    console.log('─────────────────────────────');
});