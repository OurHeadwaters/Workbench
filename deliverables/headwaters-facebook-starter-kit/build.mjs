import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Create PDF
  console.log('Generating PDF...');
  await page.goto(`file://${path.join(__dirname, 'kit.html')}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.join(__dirname, 'Headwaters-Facebook-Marketing-Starter-Kit.pdf'),
    format: 'Letter',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  // Create PNGs
  const visuals = ['visual-a', 'visual-b', 'visual-c', 'visual-d'];
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  
  for (const v of visuals) {
    console.log(`Generating ${v}.png...`);
    await page.goto(`file://${path.join(__dirname, v + '.html')}`, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(__dirname, v + '.png') });
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
