const puppeteer = require('puppeteer');
const productsListGetter = require('./test')
let prevLink =[];
(async () => {
    try{
    const SELECTOR = "div.text-center"
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()    
    page.setDefaultNavigationTimeout(0)
    await page.goto("https://www.almirah.com.pk/")
    await page.waitForSelector(SELECTOR);
    const content = await page.$$(`${SELECTOR} > ul > li`)
    let parentArray = []
    for(var i = 0; i < content.length; i++){
        let item = await page.evaluate((SELECTOR, i) => {
          let a = document.querySelectorAll(`${SELECTOR} > ul > li > a`)
        return{
            data: {
                anchor : a[i].href,
                title: a[i].innerHTML.trim()
            }
        }
        }, SELECTOR, i)
        parentArray = [...parentArray, item]
    }
    let childArray = []
    const allAnchors = await page.$$('div.text-center div.grid--center a')
    for(var i =0; i< allAnchors.length; i++){
        let item = await page.evaluate((i) => {
            const a = document.querySelectorAll('div.text-center div.grid--center div.grid__item a')
            return {
                a: a[i].href,
                image: a[i].style.backgroundImage,
                parent: a[i].parentElement.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerText
            }
        },i)
        childArray = [...childArray, item]
    }
    
    let combined = parentArray.map(parent => {
        return {
            name: parent.data.title,
            children: (() => {
                        let z = []
                        for(let i = 0 ; i < childArray.length; i++){
                            if(childArray[i].parent == parent.data.title)
                                z.push({a: childArray[i].a})
                        }
                        return z
                    })()
        }
    })

    combined.forEach(com => {
        console.log(com)
    })

    await browser.close()
        for(let j = 0; j < combined.length; j++){
        for(let i = 0; i < combined[j].children.length; i++){
            // console.log("blah blah blah",combined[j].children[i].a)
            prevLink.push(`${combined[j].children[i].a}`)
            await productsListGetter(combined[j].children[i].a)
           
            // await page.goto(`${combined[j].children[i].a}`)

            // await page.waitForNavigation()    this will not work it will break the page
            
        }
      
    }
    await page.screenshot({ path: 'example.png' });
    // await browser.close()
    console.log({prevLink})

}
catch (err) {
    console.error(err.message);
  } 
//   finally{

//     await page.screenshot({ path: 'example.png' });
//     await browser.close()
//   }
})()

module.exports = prevLink