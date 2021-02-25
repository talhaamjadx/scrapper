const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.google.com';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0)
    await page.goto(url, { waitUntil: "networkidle2"})
    const item = await page.evaluate(() => {
        let title = document.querySelector("img[class='lnXdpd']").alt
        return {
            title: title
        }
    })
    console.log(item)
    await browser.close()
})()