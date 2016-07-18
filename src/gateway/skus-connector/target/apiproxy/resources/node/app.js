var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

var routes = require('./routes/routes.js');


// /sku/skuid (getting a specific sku)
app.get('/:skuid', routes.get);


app.listen(3000, function() {
    console.log('App listening on port 3000!');
});