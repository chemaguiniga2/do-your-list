const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const auth = require('../middleware/auth');
const { Usuario, validate } = require('../models/usuario');
const { Producto, validateProd } = require('../models/producto');
const { prodScrap, validateProdScrap } = require('../models/prodScrap');
const puppeteer = require('puppeteer');



router.get('/', (req, res) => {
    //Si el cliente ya tiene una sesión activa, mandar a /mi_lista
    if (req.session.login) return res.redirect('/mi_lista');
    //res.sendFile('index.ejs', {root: path.join(__dirname, './public')});
    res.render('index', {}) ;
});

router.get('/login', (req, res) => {
    res.render('login', {});
});

router.get('/register', (req, res) => {
    res.render('register', {});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

/*router.post('/login', async (req, res) => {
    //Procesar login, para guardar datos en sesión se puede usar req.session.propiedad = valor;
    ///trainer/<%= i.name %>
    const usuario = await Usuario
        .findOne({ email: req.body.email });
    req.session.email = req.body.email;
    if (!usuario) return res.status(404).render('error', { error: 404, message: 'No se encontró el usuario.'});
    if (usuario.password !== req.body.password) return res.status(404).render('error', { error: 404, message: 'No coincide usuario y contraseña.'});
    res.render('lista_productos', { usuario });   
    
});*/

router.post('/login', passport
    .authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        passReqToCallback: true
}));

/*router.post('/register', (req, res) => {
    //Procesar login, para guardar datos en sesión se puede usar req.session.propiedad = valor;
    let {login, password} = req.body;
    if (usuarios.hasOwnProperty(login)){
        //Mandar mensaje de que ya existe usuario con ese username
        return res.redirect('/register');
    }
    usuarios[login] = guardarUsuario(password);
    req.session.login = login;
    return res.redirect('/mi_lista');   
    
});*/

/*router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).render('error', { error: 400, message: error.details[0].message });

    let usuario = await Usuario.findOne({ email: req.body.email });
    if (usuario) return res.status(400).render('error', { error: 400, message: 'El usuario ya fue registrado previamente' });

    usuario = new Usuario({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender
    });
    req.session.email = req.body.email;
    await usuario.save();
    return res.redirect('/mi_lista'); 
    
    //return res.redirect(`/trainer/${ req.body.name }`);
    
});*/

router.post('/register', passport
    .authenticate('local-register', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        passReqToCallback: true
}));



router.get('/mi_lista', auth, async (req, res) => {
    let usuario = req.user;
    /*(async () => {
        let url = 'https://super.walmart.com.mx/quesos/queso-tipo-chihuahua-arla-400-g/00571195304732';
    
        let browser = await puppeteer.launch();
        let page = await browser.newPage();
    
        await page.goto(url, {waitUntil: 'networkidle2'});
        
        let data = await page.evaluate(() => {
            let titulo = document.querySelector('#root > div > div > main > div.ez6st4XksKUGZfGdvIhjV > section > div:nth-child(1) > div._1mp6DRSv6MS2tqc65wTjwJ > div.vQMIKtScxt-0gP4BIwEhI > span > h1').innerText;
            let precio = document.querySelector('#root > div > div > main > div.ez6st4XksKUGZfGdvIhjV > section > div:nth-child(1) > div._1mp6DRSv6MS2tqc65wTjwJ > div.vQMIKtScxt-0gP4BIwEhI > div.FVpRm-ZwHtHVwahtm--xo > h4').innerText;
    
            return {
                titulo, 
                precio
            }
    
        });
    
        console.log(data);
        let producto = new prodScrap({
            name: data.titulo,
            categoria: 'Lácteos',
            precio: data.precio
    
        });
    
        await producto.save();
    
        await browser.close();
    
    })();*/
    res.render('agregar_productos', {usuario});
});

router.get('/promociones', auth, async (req, res) => {
    let usuario = req.user;

    let data = (async function main() {
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

    res.render('scrapper', {usuario, data});

});

router.get('/productos/lista', auth, async (req, res) => {
    let usuario = req.user;
    const pageSize = parseInt(req.query['pageSize']) || 5;
    let pageNumber = parseInt(req.query['pageNumber']) || 1;
    const producto = await Producto
        .find({ usuario: usuario._id })
        .limit(10)
        .sort({ fecha: 1 })
        .select({_id: 0, name:1, categoria:1, fecha: 1, cantidad: 1, unidad: 1, usuario: 1});
    res.render('lista_productos', {usuario, producto, pageSize, pageNumber});
});

router.post('/productos/lista', auth, async (req, res) => {

    const { error } = validateProd(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let producto = new Producto({
        name: req.body.name,
        unidad: req.body.unidad,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria,
        fecha: Date.now(),
        usuario: req.user._id
    });

    await producto.save();

    return res.redirect('/mi_lista');


});


router.get('/profile', auth, async (req, res) => {
    let usuario = req.user;
    res.render('usuario', { usuario });
});



module.exports = router;