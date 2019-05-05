require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const rootRouter = require('./routes/root');
const rootRouterApi = require('./routes/apiAgregar');
const rootRouterApiProducto = require('./routes/apiProducto');
const passport = require('passport');
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
// Mi comentario2!!

mongoose.connect(process.env.DB_CON, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('Error...', err.message));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${ port }`));