const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const productsDetail = require('./ali')
var linkList = [];

const productsListGetter = async (link) => {
    return new Promise(async (resolve,reject) => {
    const browser = await puppeteer.launch({ headless: true })
    const [page] = await browser.pages()
    await page.goto(link  , {waitUntil : 'domcontentloaded'})
    await page.waitForTimeout(3000)
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

        console.log({pagelinkList})

        for (var j = 0; j < pagelinkList.length; j++) {

            await page.goto(pagelinkList[j])
         
            // await page.close()
            // for the links

            var productLinks = $('.grid-product__link');
            // console.log({productLinks})


            for (var i = 0; i < productLinks.length; i++) {
                // console.log("here")
                // linkList.push(`https://www.almirah.com.pk${productLinks[i].attribs.href}`)
                await productsDetail(`https://www.almirah.com.pk${productLinks[i].attribs.href}`)
                await browser.close()
            }

          

        }
       

      
     
    })
    resolve('promise resolved')
})
}


module.exports = productsListGetter