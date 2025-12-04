const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const {runAxe} = require('@axe-core/puppeteer');

const runAccessibilityScan = async (url) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000, // wait max 30s for full load
    });

    //await page.waitForTimeout(5000);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const results = await new AxePuppeteer(page).analyze();
    const htmlSnapshot = await page.content(); // HTML of the scanned page
    return results;

  }
  catch(err){
    console.error('Axe analysis error:', err.message);
    throw err;
  } 
  finally {
    await browser.close();
  }
};

module.exports = runAccessibilityScan