const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const usuarios = {};


function guardarUsuario(password){
    usuario = {
        password: password,
        productos: "Lista de compras..."
    }
    return usuario;
}


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

router.post('/login', (req, res) => {
    //Procesar login, para guardar datos en sesión se puede usar req.session.propiedad = valor;
    let {login, password} = req.body;
    if (usuarios.hasOwnProperty(login)){
        if (usuarios[login].password === password) {
            req.session.login = login;
            return res.redirect('/mi_lista');
        }
        else{
            //return res.sendFile('index.html', {root: path.join(__dirname, './public')});
            res.render('index', {}) ;
        }
    }
    // Mandar mensaje de que no existe usuario con ese username
    // Redirigir a /register
    return res.redirect('/register'); 
    
});

router.post('/register', (req, res) => {
    //Procesar login, para guardar datos en sesión se puede usar req.session.propiedad = valor;
    let {login, password} = req.body;
    if (usuarios.hasOwnProperty(login)){
        //Mandar mensaje de que ya existe usuario con ese username
        return res.redirect('/register');
    }
    usuarios[login] = guardarUsuario(password);
    req.session.login = login;
    return res.redirect('/mi_lista');   
    
});



router.get('/mi_lista', (req, res) => {
    // Desplegar lista en archivo EJS
    let usuario = req.session.login; 
    let productos = usuarios[usuario].productos;
    console.log(usuario);
    res.render('mi_lista', {usuario: usuario, productos: productos});
});

module.exports = router;