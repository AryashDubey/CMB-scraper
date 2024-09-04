const puppeteer = require("puppeteer");
const UserAgent = require('user-agents');

// Add this at the top of the file
const proxyList = [
 'http://142.93.56.161:3128',
 'http://142.93.56.161:3129',
 'http://142.93.56.161:3130',
 'http://142.93.56.161:3131',
 'http://142.93.56.161:3132',
 'http://142.93.56.161:3133',
 'http://142.93.56.161:3134',
 'http://142.93.56.161:3135',
 'http://142.93.56.161:3136',
 'http://142.93.56.161:3137',
 'http://142.93.56.161:3138',
 'http://142.93.56.161:3139',
 'http://142.93.56.161:3140',
];

async function searchProduct(query) {
  // Select a random proxy from the list
  const randomProxy = proxyList[Math.floor(Math.random() * proxyList.length)];

  const browser = await puppeteer.launch({ 
    headless: true,
    args: [`--proxy-server=${randomProxy}`] // Add this line to use the selected proxy
  });

  const page = await browser.newPage();
  // Set a realistic user agent
  const userAgent = new UserAgent();
  await page.setUserAgent(userAgent.toString());
  
  await page.setViewport({ width: 1080, height: 1024 });
  
  // Implement rate limiting
  await page.goto(`https://www.homedepot.com/s/${encodeURIComponent(query)}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  
  await page.waitForSelector('[data-testid="product-pod"]');

  // Extract product information
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-testid="product-pod"]')).map(product => {
        const nameElement = product.querySelector('[data-testid="product-header"] a');
        const priceElement = product.querySelector('.price__wrapper .price-format__main-price');

        const name = nameElement ? nameElement.innerText.trim() : 'No name available';
        const link = nameElement ? nameElement.href : 'No link available';
        const price = priceElement ? `${priceElement.textContent.trim()}` : 'Price not available';

        return { name, link, price };
    });
  });

  await browser.close();
  return products;
}

module.exports = searchProduct;