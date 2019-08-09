'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

var user_routes = require('./routes/userRoutes');
var encuesta_routes = require('./routes/encuestaRoutes');

app.use(bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api', user_routes, encuesta_routes);

module.exports = app;