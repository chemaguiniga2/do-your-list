const puppeteer = require('puppeteer');
const { prodScrap, validateProdScrap } = require('../models/prodScrap');

(async function main() {
    try {
        let url = 'https://www.costco.com.mx/';

        let browser = await puppeteer.launch({ headless: true });
        let page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector('div.carousel-component.costco-carousel-component.clearfix');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');

        const sec = await page.$$('div.carousel-component.costco-carousel-component.clearfix');
 
        let prodsRelev = [];
        for (const se of sec) {
            let dat = {};
            dat.name = await se.$eval('div.item-name.ch-name.notranslate', p => p.innerText);
            dat.price = await se.$eval('div.original-price', e => e.innerText);
            prodsRelev.push(dat);
        }
        
        await page.goto('https://www.costco.com.mx/Comida-y-Bebida/Cafe-Te-y-Bebidas/Leche/c/cos_6.6.7');

        await page.waitForSelector('li.product-item.vline');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');;
       
        const secLact = await page.$$('li.product-item.vline');
        

        let prodsLacteo = [];

        for (const se of secLact) {
            let dat = {};
            dat.titulo = await se.$eval('div.product-name-container', p => p.innerText);
            dat.precio = await se.$eval('div.original-price', e => e.innerText);
         

            prodsLacteo.push(dat);
        }
 

        await page.goto('https://www.costco.com.mx/Comida-y-Bebida/Institucional/Despensas/c/cos_6.11.1');

        await page.waitForSelector('li.product-item.vline');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');;
       
        const secDesp = await page.$$('li.product-item.vline');
        
       
        let prodsDesp = [];

        for (const se of secDesp) {
            let dat = {};
            dat.titulo = await se.$eval('div.product-name-container', p => p.innerText);
            dat.precio = await se.$eval('div.original-price', e => e.innerText);
            //console.log('name', titulo);

            prodsDesp.push(dat);
        }
 


        await page.goto('https://www.costco.com.mx/Comida-y-Bebida/Kirkland-Signature/c/cos_6.12');

        await page.waitForSelector('li.product-item.vline');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');;
       
        const secKirk = await page.$$('li.product-item.vline');
        
       
        let prodsKirk = [];

        for (const se of secKirk) {
            let dat = {};
            dat.titulo = await se.$eval('div.product-name-container', p => p.innerText);
            dat.precio = await se.$eval('div.original-price', e => e.innerText);
            //console.log('name', titulo);

            prodsKirk.push(dat);
        }


        

        await browser.close();

    } catch (e) {
        console.log('Error', e);
    }
    
})();

