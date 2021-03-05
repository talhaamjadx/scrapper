const puppeteer = require('puppeteer');
const cheerio = require('cheerio');



(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0)
    const productName_Selector = '.product-single__meta > h1'
    const productSku_Selector = '.product-single__sku'
    const productPrice_Selector = '.product__price >span'
    const productImage_Selector = '.image-wrap > .photoswipe__image'
    const productDetails_Selector = '.table-wrapper > table'


    await page.goto('https://www.almirah.com.pk/collections/kameez-shalwar-collection-3/products/al-kt-2584-v1-2021');


    await page.waitForSelector(productName_Selector)
    await page.waitForSelector(productSku_Selector)
    await page.waitForSelector(productPrice_Selector)
    await page.waitForSelector(productImage_Selector)
    await page.waitForSelector(productDetails_Selector)


    const name = await page.$eval(productName_Selector, e => e.innerHTML)
    const sku = await page.$eval(productSku_Selector, e => e.innerHTML)
    const price = await page.$eval(productPrice_Selector, e => e.innerHTML)




    const content = page.content()
    content.then(async success => {
        const $ = cheerio.load(success)
        let color = $(`#Product-content-1-6439076987029 > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)`).text().trim()
        let pieces = $(`div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)`).text().trim()
        let fitType = $(`div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)`).text().trim()
        let fabric = $(`div > div > table > tbody > tr:nth-child(4) > td:nth-child(2)`).text().trim()
        let collection = $(`div > div > table > tbody > tr:nth-child(5) > td:nth-child(2)`).text().trim()
        let volume = $('#Product-content-1-6439076987029 > div > div > table > tbody > tr:nth-child(6) > td:nth-child(2)').text().trim()
        let disclaimer = $('#Product-content-1-6439076987029 > div > div > table > tbody > tr:nth-child(7) > td:nth-child(2)').text().trim()

        let productMoreDetailes = Object.assign({ color }, { pieces }, { fitType }, { fabric }, { collection }, [volume], [disclaimer])

        console.log(productMoreDetailes)

        //for the sizes

        var sizes = $('.variant-wrapper > #ProductSelect-6439076987029-option-0 > .variant-input');
        var sizesList = [];
        for (var size of sizes) {
            sizesList.push(size.attribs['data-value']);
        }

        //for the color

        var colors = $('.variant-wrapper > #ProductSelect-6439076987029-option-1 > .variant-input');
        var colorList = [];
        for (var productColor of colors) {
            colorList.push(productColor.attribs['data-value']);
        }


        //for the images
        let imageArr = []

        const productImages = $('.product__thumb > img');

        for (let i = 0; i < productImages.length; i++) {
            imageArr.push(productImages[0].attribs.srcset)
        }

        console.log(name)
        console.log(sku)
        console.log(price)
        console.log(sizesList)
        console.log(colorList)
        console.log({ imageArr })

    })







})()