import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
//import pdfParse from 'pdf-parse';
const pdfParse = require('pdf-parse');
//import * as pdfParse from 'pdf-parse';
// import * as pdfParseModule from 'pdf-parse';
// const pdfParse = pdfParseModule.default || pdfParseModule;
import { readFile } from 'node:fs/promises'; //modern explicit import
import { extractText, getDocumentProxy } from 'unpdf';



test('Download a file', async ({ page }) => {

    await page.goto('https://demo.automationtesting.in/FileDownload.html');
    const downloadLink = page.locator('.btn-primary');

    const [download] = await Promise.all([
        page.waitForEvent('download'),  // ✅ listener ready FIRST
        downloadLink.click(),            // ✅ triggers download
    ]);

    console.log(`Suggested filename: ${download.suggestedFilename()}`);
    console.log(`Download URL: ${download.url()}`);

    const savePath = path.join(
        process.cwd(),
        'downloads',
        download.suggestedFilename()
    );

    await download.saveAs(savePath);

    expect(fs.existsSync(savePath)).toBe(true);
    const fileInfo = fs.statSync(savePath).size;
    expect(fileInfo).toBeGreaterThan(0);
    console.log(fileInfo);
    console.log(`✅ File saved to: ${savePath}`);

    await page.close();
});

test('Extract text from invoice PDF using unpdf', async () => {

    const pdfPath = path.join(process.cwd(),'wordpress-pdf-invoice-plugin-sample.pdf');
    const buffer = await readFile(pdfPath);

    // ✅ Step 2 — Get document proxy
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    // ✅ Step 3 — Extract ALL text
    const { text } = await extractText(pdf, { mergePages: true });

    // ✅ Step 4 — Output to terminal
    console.log('─────────────────────────────');
    console.log('📄 Extracted Invoice Text:');
    console.log('─────────────────────────────');
    console.log(text);
    console.log('─────────────────────────────');

    // ✅ Step 5 — Verify text found
    expect(text.length).toBeGreaterThan(0);
});

test('Download invoice pdf from URL', async ({ page, request }) => {

    //Create folder if not available and make an if statement if folder has created or not
    const downloadsDir = path.join(process.cwd(), 'inovoices');
    if(!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // const [download] = await Promise.all([
    //     page.waitForEvent('download'),
    //     page.goto('https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf'),
    // ])

    const response = await request.get(
        'https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf'
    );

    
    expect(response.ok()).toBeTruthy();
    const buffer = await response.body();
    const savePath = path.join(downloadsDir, 'sample-invoice.pdf');
    fs.writeFileSync(savePath, buffer);

    // const fileName = download.suggestedFilename() || 'sample-invoice.pdf';
    // const savePath = path.join(downloadsDir, fileName);
    // await download.saveAs(savePath);

    expect(fs.existsSync(savePath)).toBe(true);
    const fileSize = fs.statSync(savePath).size;
    expect(fileSize).toBeGreaterThan(0);
})

test('Extract text from invoice PDF2 using unpdf', async () => {

    const pdfPath = path.join(process.cwd(),'inovoices','sample-invoice.pdf');
    const buffer = await readFile(pdfPath);

    // ✅ Step 2 — Get document proxy
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    // ✅ Step 3 — Extract ALL text
    const { text } = await extractText(pdf, { mergePages: true });

    // ✅ Step 4 — Output to terminal
    console.log('─────────────────────────────');
    console.log('📄 Extracted Invoice Text:');
    console.log('─────────────────────────────');
    console.log(text);
    console.log('─────────────────────────────');

    // ✅ Step 5 — Verify text found
    expect(text.length).toBeGreaterThan(0);
});


test('Download invoice pdf from URL using button', async ({ page, request }) => {

    await page.goto('https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf');
    await page.waitForLoadState('networkidle');
    const downloadButton = page
        .locator('iframe[name="11AC0354E6C38AFD30D5670CED17F1EA"]').contentFrame().getByRole('button', { name: 'Download' })
    await expect(downloadButton).toBeVisible();


    const downloadsDir = path.join(process.cwd(), 'inovoices');
    if(!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }),
        downloadButton.click(),
    ]);

    const savePath = path.join(downloadsDir, download.suggestedFilename());
    await download.saveAs(savePath);
    // const [download] = await Promise.all([
    //     page.waitForEvent('download'),
    //     page.goto('https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf'),
    // ])

    // const fileName = download.suggestedFilename() || 'sample-invoice.pdf';
    // const savePath = path.join(downloadsDir, fileName);
    // await download.saveAs(savePath);

    expect(fs.existsSync(savePath)).toBe(true);
    const fileSize = fs.statSync(savePath).size;
    expect(fileSize).toBeGreaterThan(0);
})





