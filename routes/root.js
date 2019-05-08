const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const auth = require('../middleware/auth');
const { Usuario, validate } = require('../models/usuario');
const { Producto, validateProd } = require('../models/producto');
//const { prodScrap, validateProdScrap } = require('../models/prodScrap');
const puppeteer = require('puppeteer');

let prodsRelev = [];

let prodsLacteo = [];
let prodsDesp = [];
let prodsKirk = [];



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
        successRedirect: '/mi_lista',
        failureRedirect: '/register',
        passReqToCallback: true
}));



router.get('/mi_lista', auth, async (req, res) => {
    let usuario = req.user;
    res.render('agregar_productos', {usuario});
});

router.get('/promociones', auth, async (req, res) => {
    let usuario = req.user;


    res.render('scrapper', {usuario, prodsRelev, prodsLacteo, prodsDesp, prodsKirk});

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
    const producto = await Producto
        .find({ usuario: usuario._id })
        .limit(10)
        .sort({ fecha: 1 })
        .select({_id: 1, name:1, categoria:1, fecha: 1, cantidad: 1, unidad: 1, usuario: 1});

    res.render('usuario', { usuario, producto });
});

router.get('/borrar/:id', auth ,async (req, res) => {
    let id = req.params.id;
    const producto = await Producto.deleteOne({ _id: id });
    if (!producto) return res.status(404).send('Producto no encontrado.');
    return res.redirect('/profile');
});

router.get('/editar/:id', auth, async (req, res) => {
    let usuario = req.user;
    let id = req.params.id;
    const producto = await Producto.findOne({ _id: id });
    if (!producto) return res.status(404).send('Producto no encontrado');
    res.render('editar_producto', { producto, usuario });
});

router.post('/editar/:id', auth, async (req, res) => {
    let id = req.params.id;
    const producto = await Producto.findOneAndUpdate({ _id: id }, {
        $set: {
            name: req.body.name,
            unidad: req.body.unidad,
            cantidad: req.body.cantidad,
            categoria: req.body.categoria
        }
    }, { new: true });
    if (!producto) return res.status(404).send('Producto no encontrado.');
    return res.redirect('/profile');


});

(async function getOffers() {
    try {
        let url = 'https://www.costco.com.mx/';

        let browser = await puppeteer.launch({ headless: true });
        let page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector('div.carousel-component.costco-carousel-component.clearfix');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');

        const sec = await page.$$('div.carousel-component.costco-carousel-component.clearfix');
 
        
        for (const se of sec) {
            let dat = {};
            dat.titulo = await se.$eval('div.item-name.ch-name.notranslate', p => p.innerText);
            dat.precio = await se.$eval('div.original-price', e => e.innerText);
            prodsRelev.push(dat);
        }
        
        await page.goto('https://www.costco.com.mx/Comida-y-Bebida/Cafe-Te-y-Bebidas/Leche/c/cos_6.6.7');

        await page.waitForSelector('li.product-item.vline');
        page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');;
       
        const secLact = await page.$$('li.product-item.vline');
        


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



module.exports = router;