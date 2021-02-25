const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0)

    const MODAL_BUTTON_SELECTOR = '.modal-footer > button';
    const SEARCH_SELECTOR = 'input[placeholder=Search]';
    const LOCATION_SELECTOR = 'li.active > a';
    const RESULTS_SELECTOR = '.results-tab';

    await page.goto('https://native-land.ca/');
    await page.click(MODAL_BUTTON_SELECTOR);
    await page.waitForTimeout(500);

    await page.click(SEARCH_SELECTOR);
    await page.keyboard.type('Philadelphia');
    await page.waitForSelector(LOCATION_SELECTOR);

    await page.click(LOCATION_SELECTOR);
    await page.waitForSelector(`${RESULTS_SELECTOR} > p`);

    const results = await page.$(RESULTS_SELECTOR);
    console.log({ results })
    const text = await results.evaluate(element => {
        return {
            element: element
        }
    }, element);
    console.log(text);

    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();