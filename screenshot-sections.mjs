import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

// Scroll to trigger all reveal animations
await page.evaluate(async () => {
  await new Promise(resolve => {
    let pos = 0;
    const timer = setInterval(() => {
      window.scrollBy(0, 400);
      pos += 400;
      if (pos >= document.body.scrollHeight) {
        window.scrollTo(0, 0);
        clearInterval(timer);
        resolve();
      }
    }, 80);
  });
});
await new Promise(r => setTimeout(r, 800));

const sections = ['#about', '#services', '#process', '#contact'];

// Hero (top of page)
await page.screenshot({ path: 'temporary screenshots/s-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log('Saved s-hero.png');

for (const sel of sections) {
  const el = await page.$(sel);
  if (el) {
    await el.scrollIntoView();
    await new Promise(r => setTimeout(r, 500));
    // Screenshot the current viewport (no clip — scrollIntoView moved us there)
    await page.screenshot({
      path: `temporary screenshots/s-${sel.replace('#','')}.png`,
    });
    console.log(`Saved s-${sel.replace('#','')}.png`);
  }
}

await browser.close();
