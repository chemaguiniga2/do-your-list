require('dotenv').config();
require('./startup/logging')();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const rootRouter = require('./routes/root');
const rootRouterApi = require('./routes/apiAgregar');
const rootRouterApiProducto = require('./routes/apiProducto');
const passport = require('passport');
const error = require('./middleware/error');
require('./passport/local');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false    
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded( {extended: false }));
app.set('view engine', 'ejs');

app.use(express.json());
app.use('/api/producto', rootRouterApiProducto);
app.use('/api', rootRouterApi);
app.use('/', rootRouter); 
app.use(error);

if (!process.env.PORT){
    throw new Error('No hay puerto definido para el servidor.');
}

if (!process.env.DB_CON){
    throw new Error('No hay ruta definida para la base de datos.');
}

const db_con = process.env.NODE_ENV !== 'test' ? process.env.DB_CON : process.env.DB_CON_TEST;

mongoose.connect(db_con, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Conectado a MongoDB...'))
    //.catch(err => console.log('Error...', err.message))
    ;

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Escuchando en el puerto ${ port }`));

module.exports = server;