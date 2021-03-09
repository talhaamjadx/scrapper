const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const productsDetail = require('./ali')
var linkList = [];

const productsListGetter = async (link) => {
    return new Promise(async (resolve,reject) => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(link)
    const content = page.content()
    content.then(async success => {
        const $ = cheerio.load(success)




        // console.log(linkList)


        //for the paggination links

        var paginationLinks = $('.page > a');
        var pagelinkList = [];

        for (var i = 0; i < paginationLinks.length; i++) {
            pagelinkList.push(`https://www.almirah.com.pk${paginationLinks[i].attribs.href}`)
        }

        console.log(pagelinkList)

        for (var j = 0; j < pagelinkList.length; j++) {

            await page.goto(pagelinkList[j])
         

            // for the links

            var productLinks = $('.grid-product__link');
            // console.log({productLinks})3


            for (var i = 0; i < productLinks.length; i++) {
                linkList.push(`https://www.almirah.com.pk${productLinks[i].attribs.href}`)
                // await productsDetail(`https://www.almirah.com.pk${productLinks[i].attribs.href}`)
            }

            linkList = [...new Set(linkList)]

        }
       

        console.log(linkList)
        await browser.close()
    })
    resolve('promise resolved')
})
}


module.exports = productsListGetter