const puppeteer = require('puppeteer');

const chromeUrl = 'http://127.0.0.1:9222';

const url = 'https://vkusvill.ru/cart/';

const productsSliderSelector = '.OrderFormProdSliderSwiperWrapper[data-list-name="Корзина Зеленые ценники"]';

const productsCardSelector = '.ProductCard__content';

const scrapeFromOpenedBrowser = async () => {
  try {
    const browser = await puppeteer.connect({
      browserURL: chromeUrl
    });

    const pages = await browser.pages();

    const page = await pages[0];

    await page.setViewport({width: 1920, height: 1080});

    await page.goto(url);

    await page.waitForSelector(productsSliderSelector);

    const titlesPricesArray = await page.$$eval(`${productsSliderSelector} ${productsCardSelector}`,
      results => {

        return results.map(res => {

          const productTitleSelector = '.ProductCard__link';
          const productPriceSelector = '.Price--green-label .Price__value';

          const title = res.querySelector(productTitleSelector).title;
          const price = res.querySelector(productPriceSelector).innerText;

          return {
            title,
            price
          };

        });

      });

    await browser.close();

    return titlesPricesArray;

  } catch (err) {
    console.log(err);
  }
}

scrapeFromOpenedBrowser()
  .then(res => console.log(res));