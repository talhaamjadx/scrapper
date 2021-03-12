const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { contains } = require('cheerio');



const productsDetail = async (link) => {
    const browser = await puppeteer.launch({ headless: true });
    const [page] = await browser.pages()
    await page.goto(link  , {waitUntil : 'domcontentloaded'});
    page.setDefaultNavigationTimeout(0)
    const productName_Selector = '.product-single__meta > h1'
    const productSku_Selector = '.product-single__sku'
    const productPrice_Selector = '.product__price >span'
    const productNewPrice_Selector = '.on-sale >span'
    const productImage_Selector = '.image-wrap > .photoswipe__image'
    const productDetails_Selector = '.table-wrapper > table'





    await page.waitForSelector(productName_Selector)
    await page.waitForSelector(productSku_Selector)
    await page.waitForSelector(productPrice_Selector)
    await page.waitForSelector(productImage_Selector)
    await page.waitForSelector(productDetails_Selector)
    // await page.waitForSelector(productNewPrice_Selector)


    const name = await page.$eval(productName_Selector, e => e.innerHTML)
    const sku = await page.$eval(productSku_Selector, e => e.innerHTML)
    const price = await page.$eval(productPrice_Selector, e => e.innerHTML)
    // const Newprice = await page.$eval(productNewPrice_Selector, e => e.innerHTML)




    const content = page.content()
    content.then(async success => {
        const $ = cheerio.load(success)



            let states = {}

            states.color = $(`.table-wrapper > table > tbody > tr:nth-child(1) > td:nth-child(2)`).text().trim();
            states.pieces = $(`.table-wrapper > table > tbody > tr:nth-child(2) > td:nth-child(2)`).text().trim();
            states.fitType =$(`.table-wrapper > table > tbody > tr:nth-child(3) > td:nth-child(2)`).text().trim();
            states.fabric = $(`.table-wrapper > table > tbody > tr:nth-child(4) > td:nth-child(2)`).text().replace(/\s+/g, ' ').trim();
            states.collection = $(`.table-wrapper > table > tbody > tr:nth-child(5) > td:nth-child(2)`).text().trim();
            states.volume = $('.table-wrapper > table > tbody > tr:nth-child(6) > td:nth-child(2)').text().trim();
            states.disclaimer = $('.table-wrapper > table > tbody > tr:nth-child(7) > td:nth-child(2)').text().trim();
         
``
    
        //for the sizes

            // let check = $(' label:contains("Size")').parent();
            // let check1 = check.find('input')

            // console.log(check1)

            // check1.each((i, element)=>{
            //     const $element = $(element);
            //     const sizeState = {};
            //     sizeState.size = $element.find('.variant__button-label').text().trim()
            //     console.log(sizeState)

            // })
          
       
       

        var sizes = $(' .variant-wrapper > .variant-input-wrap > .variant-input label');
       
        var sizesList = [];
        for (var size of sizes) {
          if(!size.attribs.class.includes("disabled"))
            sizesList.push(size.children[0].data);
        }
      

        //for the color

        // var colors = $('.variant-wrapper > #ProductSelect-6439076987029-option-1 > .variant-input');
        // var colorList = [];
        // for (var productColor of colors) {
        //     colorList.push(productColor.attribs['data-value']);
        // }


        //for the images
        let imageArr = []

        const productImages = $('.product__thumb > img');

        for (let i = 0; i < productImages.length; i++) {
            imageArr.push(productImages[0].attribs.srcset)
        }
        // console.log('location.href: ' + await page.evaluate(() => location.href));
         console.log(name)
        console.log(sku)
        console.log(price)
        // console.log(Newprice)
        console.log(sizesList)
        // console.log(colorList)
           console.log(states)
        console.log({ imageArr })
        await browser.close()
    })
    // resolve('promise resolved')
}
module.exports = productsDetail