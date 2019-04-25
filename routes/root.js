const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const auth = require('../middleware/auth');
const { Usuario, validate } = require('../models/usuario');
const { Producto, validateProd } = require('../models/producto');



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
    res.render('agregar_productos', {usuario});
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
    console.log(producto);
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