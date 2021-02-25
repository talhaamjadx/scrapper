const puppeteer = require('puppeteer');

(async () => {
    const SELECTOR = "div[class='grid__item slick-slide slick-current slick-active']"
    const SECONDSELECTOR = "div[class='grid-product__content']"
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()    
    page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.almirah.com.pk/")
    await page.waitForSelector(SELECTOR);
    const a = await page.$(`${SELECTOR} > a`);
    // console.log({a})
    a.click()
    await page.waitForNavigation();
    await page.waitForSelector(SECONDSELECTOR);
    const b = await page.$(`${SECONDSELECTOR} > a`);
    // console.log({b})
    b.click()
    await page.waitForNavigation();
    const content = await page.evaluate(() => {
        return {
            title: document.querySelector("div[class='product-single__meta'] > h1").innerHTML,
            sn: document.querySelector("div[class='product-single__meta'] > p").innerHTML,
            price: document.querySelector("div[class='product-single__meta'] > span[class='product__price'] > span").innerHTML,
            // image: document.querySelector("div[class='image-wrap'] > img")
        }
    })
    console.log({content})
    await page.screenshot({ path: 'example.png' });
    await browser.close()
})()