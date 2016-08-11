var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

//var logger = require('morgan');
//app.use(logger('combined'));

var routes = require('./routes/routes.js');

app.get('/', routes.searchProducts);

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});