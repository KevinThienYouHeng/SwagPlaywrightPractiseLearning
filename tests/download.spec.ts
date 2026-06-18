import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';


test('Download a file', async ({ page }) => {

    // ✅ Step 1 — Navigate to page
    await page.goto('https://demo.automationtesting.in/FileDownload.html');

    // ✅ Step 2 — Locate the download link
    const downloadLink = page.locator('.btn-primary');

    // ✅ Step 3 — Listen for download AND click simultaneously!
    const [download] = await Promise.all([
        page.waitForEvent('download'),  // ✅ listener ready FIRST
        downloadLink.click(),            // ✅ triggers download
    ]);

    // ✅ Step 4 — Get download info
    console.log(`Suggested filename: ${download.suggestedFilename()}`);
    console.log(`Download URL: ${download.url()}`);

    // ✅ Step 5 — Save to YOUR project location
    const savePath = path.join(
        process.cwd(),
        'downloads',
        download.suggestedFilename()
    );
    await download.saveAs(savePath);

    // ✅ Step 6 — Verify file exists
    expect(fs.existsSync(savePath)).toBe(true);
    console.log(`✅ File saved to: ${savePath}`);
});

test.skip('Download file', async ({ page }) => {

    // ✅ Step 1 — Navigate to page
    await page.goto('https://demo.automationtesting.in/FileDownload.html');

    // ✅ Step 2 — Locate the download link
    await page.locator('.btn-primary').click();

});