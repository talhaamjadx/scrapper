const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var mysql = require('mysql')
const productsListGetter = require('./test');


let prevLink = [];
var url = "https://www.almirah.com.pk/";


(async () => {
    try {


        const SELECTOR = "div.text-center"
        const browser = await puppeteer.launch({
            headless: true,
            userDataDir: './cache',
            args: ['--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'],
            rate: parseInt(process.env.THROTTLE)
        })

        const page = await browser.newPage()

        page.setDefaultNavigationTimeout(0)
        await page.goto(url, { waitUntil: 'domcontentloaded' })
        await page.waitForSelector(SELECTOR);
        const content = await page.$$(`${SELECTOR} > ul > li`)
        let parentArray = []
        for (var i = 0; i < content.length; i++) {
            let item = await page.evaluate((SELECTOR, i) => {
                let a = document.querySelectorAll(`${SELECTOR} > ul > li > a`)

                return {
                    data: {
                        anchor: a[i].href,
                        title: a[i].innerHTML.trim()
                    }
                }
            }, SELECTOR, i)
            parentArray = [...parentArray, item]
        }
        let childArray = []
        const allAnchors = await page.$$('div.text-center div.grid--center a')
        for (var i = 0; i < allAnchors.length; i++) {
            let item = await page.evaluate((i) => {
                const a = document.querySelectorAll('div.text-center div.grid--center div.grid__item a')

                return {
                    a: a[i].href,
                    image: a[i].style.backgroundImage,

                    parent: a[i].parentElement.parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerText,

                    childd: a[i].innerHTML.trim()
                }
            }, i)

            childArray = [...childArray, item]

        }




        let combined = parentArray.map(parent => {
            return {
                name: parent.data.title,
                parentLinks: parent.data.anchor,

                children: (() => {
                    let z = []
                    var setnames = [];
                    for (let i = 0; i < childArray.length; i++) {

                        //here Im gaining the child names

                        // console.log(childArray[i].childd)

                        if (childArray[i].parent == parent.data.title)
                          
                           setnames = childArray[i].childd
                           

                       
if(childArray[i].childd != ''){
    z.push(
        {
            a: childArray[i].a,
            names: childArray[i].childd

        }
    )
}
                            
                         

                        

                    }

                    // here im pushing the submenu links in and object
                    const results = {
                        a: z.map(obj => obj.a),
                        names: z.map(obj => obj.names)
                    };
                    return results


                })()

            }

        })


        combined.forEach(com => {
            console.log(com)

            // here I,m removing the open quote from the names

            var filtttt = [];
            filtttt = com.children.names
            var ss = [];
            for(let l = 0; l < filtttt.length; l++){

              
                        
                        ss =  filtttt[l].replace(/'/g,'')
             
              
                        // console.log(ss)
            }
      


            
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scrappe'
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected..")
})

            //for seasoon Names
            var season = "INSERT INTO sp_menu (category , url) VALUES ('" + com.name + "' , '" + com.parentLinks + "')";
            connection.query(season, function (err, result) {
                if (err) throw err;
                console.log("Sp_Menu Recored Inserted!");
            });
            connection.end();
          
            for (let k = 0; k < com.children.a.length; k++) {
               
                var connection = mysql.createConnection({
                    connectionLimit : 100000,
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'scrappe'
                })
              
                connection.connect(function (err) {
                  
                    if (err) throw err;
                    // console.log("ali", com.children.names)
                    console.log("Connected..")
                })
                
                var childss = "INSERT INTO sp_menu (sub_category , url ) VALUES ('" + ss[k] + "' , '" + com.children.a[k] + "')";

                
                connection.query(childss, function (err, result) {
                    if (err) throw err;
                    console.log("Sp_Menu Recored Inserted!");
                });
                connection.release();
                
            }

            console.log('chala geya sub!')

            // console.log(aaa);

            //         var namesss = "INSERT INTO sp_menu (category) VALUES ('"+aaa+"')";
            // connection.query(namesss, function (err, result) {
            //     if (err) throw err;
            //     console.log("Sub menu category Recored Inserted!");
            //   });

            //   var namesss = "INSERT INTO sp_menu (category) VALUES ('"+aaa+"')";
            //   connection.query(namesss, function (err, result) {
            //       if (err) throw err;
            //       console.log("Sub menu category Recored Inserted!");
            //     });

        })

        // await browser.close()
        for (let j = 0; j < combined.length; j++) {
            for (let i = 0; i < combined[j].children.length; i++) {
                // console.log("blah blah blah",combined[j].children[i].a)
                prevLink.push(`${combined[j].children[i].a}`)
                prevLink = [...new Set(prevLink)]
                // console.log({prevLink})
                // await productsListGetter(prevLink[prevLink.length-1])

                // await page.goto()

                // await page.waitForNavigation()    this will not work it will break the page

            }

        }
        await page.screenshot({ path: 'example.png' });
        await browser.close()
        // console.log( {prevLink})

    }
    catch (err) {
        console.error(err.message);
    }
    //   finally{

    //     await page.screenshot({ path: 'example.png' });
    //     await browser.close()
    //   }
})()


//Database connectivity


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'scrappe'
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected..")
})

var sql = "INSERT INTO sp_website (name) VALUES ('" + url + "')";
connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Recored Inserted!");
});

connection.end(function (err) {
    if (err) {
        return console.log(err.message);
    }
    // close all connections
});

module.exports = prevLink