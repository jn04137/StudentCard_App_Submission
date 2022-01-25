var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var scriptsRouter = require('./routes/scripts');
var apiRouter = require('./api/api');


var app = express();

//used for parsing application/json from request body
app.use(express.json());

//Setup router for the index.html page
app.use('/', indexRouter);
//Setup router for the scripts folder
app.use('/scripts', scriptsRouter);
//Setup router for the api
app.use('/api', apiRouter);

const PORT  = process.env.PORT || 3050
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`))


module.exports = app;