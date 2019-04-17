const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const { Usuario, validate, validateLogin } = require('../models/usuario');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
});
passport.use('local-register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true }, 
    async (req, username, password, done) => {

        console.log(req.body);

        const { error } = validate(req.body);
        if (error) return done(error);
        let usuario = await Usuario.findOne({ email: username });
        if (usuario) return done(null, false, { message: 'El usuario ya está registrado.'});
        
        usuario = new Usuario({
            name: req.body.name,
            password: password,
            email: username,
            gender: req.body.gender,
            productos: req.body.productos
        });


        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);


        await usuario.save();

        return done(null, usuario);

    }));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true }, 
    async (req, username, password, done) => {

        const { error } = validateLogin(req.body);
        if (error) return done(error);

        let usuario = await Usuario.findOne({ email: username });
        if (!usuario) return done(null, false, { message: 'El usuario o el password son incorrectos.'});
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) return done(null, false, { message: 'Ahí esta el problema!!.'});

        return done(null, usuario);

    }));
