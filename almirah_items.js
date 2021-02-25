const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.almirah.com.pk/")
    await page.waitForSelector("div.text-center")
    await page.screenshot({ path: "testing.png" })
    await page.waitForSelector("div.text-center > ul li a")
    await page.evaluate(() => {
        const a = document.querySelectorAll("div.text-center > ul li a")
        a[1].click()
    })
    await page.waitForNavigation()
    await autoScroll(page)
    const content = page.content()
    content.then(success => {
        const $ = cheerio.load(success)
        let arr = $('div.grid-product__title').map(a => {
            return{
                title: $('div.grid-product__title')[a].children[0].data,
                price: $('span.money')[a].children[0].data,
                image: $('div.image-wrap > img')[a].attribs.srcset
            }
        })
        console.log({arr})
    })
    await page.screenshot({path: 'testing.png'})
    await browser.close()
})()

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}