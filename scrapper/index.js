const puppeteer = require('puppeteer');
const { prodScrap, validateProdScrap } = require('../models/prodScrap');

(async function main() {
    try {
        let url = 'https://www.costco.com.mx/Comida-y-Bebida/Cafe-Te-y-Bebidas/Leche/c/cos_6.6.7';

        let browser = await puppeteer.launch();
        let page = await browser.newPage();

        await page.goto(url, {waitUntil: 'networkidle2'});
        await page.waitForSelector('li.product-item.vline');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');;
       
        const sec = await page.$$('li.product-item.vline');
        
        console.log(sec.length);
        let prods = [];

        for (const se of sec) {
            let dat = {};
            dat.titulo = await se.$eval('div.product-name-container', p => p.innerText);
            dat.precio = await se.$eval('div.original-price', e => e.innerText);
            //console.log('name', titulo);

            prods.push(dat);
        }
        

        await browser.close();

        return prods;
    } catch (e) {
        console.log('Error', e);
    }
    
})();

    //console.dir(data);
    /*let producto = new prodScrap({
        name: data.titulo,
        categoria: 'Lácteos',
        precio: data.precio

    });

    await producto.save();
*/
    

//})();