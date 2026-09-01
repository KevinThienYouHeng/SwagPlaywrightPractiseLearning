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

    //Get document proxy
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    //Extract ALL text
    const { text } = await extractText(pdf, { mergePages: true });

    const toIndex = text.indexOf('To:');
    console.log('Text around To:');
    console.log(JSON.stringify(text.substring(toIndex, toIndex + 100)));

     console.log('─────────────────────────────');

    console.log(text);

    const cleanText = text.replace(/\s+/g, ' ').trim(); 

    console.log('─────────────────────────────');
    console.log(cleanText);

    const invoiceData = {
        invoiceNumber:  cleanText.match(/Invoice Number\s+(INV-\d+)/i)?.[1] ?? 'Not found',
        orderNumber:    cleanText.match(/Order Number\s+(\d+)/i)?.[1] ?? 'Not found',
        invoiceDate:    cleanText.match(/Invoice Date\s+([A-Za-z]+\s+\d+,\s+\d{4})/i)?.[1]?.trim() ?? 'Not found',
        dueDate:        cleanText.match(/Due Date\s+([A-Za-z]+\s+\d+,\s+\d{4})/i)?.[1]?.trim() ?? 'Not found',
        totalDue:       cleanText.match(/Total Due\s+(\$[\d,.]+)/i)?.[1] ?? 'Not found',
        subTotal:       cleanText.match(/Sub Total\s+(\$[\d,.]+)/i)?.[1] ?? 'Not found',
        tax:            cleanText.match(/\bTax\s+(\$[\d,.]+)/i)?.[1] ?? 'Not found',
        total:          cleanText.match(/\bTotal\b\s+(\$[\d,.]+)/i)?.[1] ?? 'Not found',
        billTo:         cleanText.match(/To:\s+([^\n]+)/i)?.[1]?.trim() ?? 'Not found',
        vendorName:     cleanText.match(/From:\s+([^\n]+)/i)?.[1]?.trim() ?? 'Not found',
        hrs: cleanText.match(/Hrs\/Qty[\s\S]*?Sub Total\s+([0-9.]+)/i)?.[1] ?? 'Not found',
        service: cleanText.match(/Hrs\/Qty[\s\S]*?Sub Total\s+[0-9.]+\s+([A-Za-z\s]+?)\s+This is/i)?.[1] ?? 'Not Found',
        rate: cleanText.match(/Hrs\/Qty[\s\S]*?Sub Total\s+[0-9.]+\s+[A-Za-z\s]+?\s+.*?\$([0-9.,]+)/i)?.[1] ?? 'Not Found',
        adjust: cleanText.match(/Hrs\/Qty[\s\S]*?Sub Total\s+.*?\$[0-9.,]+\s+([0-9.,]+)\%/i)?.[1] ?? 'Not Found',
    };

    //Output to terminal
    console.log('─────────────────────────────');
    console.log('📄 Extracted Invoice Text:');
    console.log('─────────────────────────────');
    // console.log(invoiceData.invoiceNumber);
    // console.log(invoiceData.orderNumber);
    // console.log(invoiceData.invoiceDate);
    // console.log(invoiceData.dueDate);
    // console.log(invoiceData.totalDue);
    // console.log(invoiceData.subTotal);
    // console.log(invoiceData.tax);
    // console.log(invoiceData.total);
    // console.log(invoiceData.billTo);
    // console.log(invoiceData.vendorName)
    console.log(invoiceData.hrs);
    console.log(invoiceData.service);
    console.log(invoiceData.rate);
    console.log(invoiceData.adjust);
    console.log(invoiceData.subTotal);
    console.log('─────────────────────────────');

    //Verify text found
    expect(text.length).toBeGreaterThan(0);
});

test('Extract and Regex PDF Invoice', async ({ page }) => {

    const pdfPath = path.join(process.cwd(),'inovoices','sample-invoice.pdf');
    const buffer = await readFile(pdfPath);

    //Get document proxy
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    //Extract ALL text
    const { text } = await extractText(pdf, { mergePages: true });

    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // 6. Updated Regex: Notice we removed the quotes (") and commas (,)
    const invoiceNumberMatch = cleanText.match(/Invoice Number\s+(INV-\d+)/i);
    const orderNumberMatch = cleanText.match(/Order Number\s+(\d+)/i);
    const totalDueMatch = cleanText.match(/Total Due\s+\$([0-9.]+)/i);

    // 7. Map the data safely
    const invoiceData = {
        invoiceNumber: invoiceNumberMatch ? invoiceNumberMatch[1] : null,
        orderNumber: orderNumberMatch ? orderNumberMatch[1] : null,
        totalDue: totalDueMatch ? parseFloat(totalDueMatch[1]) : null,
    };

    console.log("Extracted Data Object:", invoiceData);

    // 8. Assertions
    expect(invoiceData.invoiceNumber).toBe('INV-3337');
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





