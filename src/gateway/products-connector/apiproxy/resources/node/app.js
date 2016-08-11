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

app.get('/:productId', routes.getProduct);
app.get('/:productId/skus', routes.getProductSkus);
app.get('/:productId/skus/:skuId', routes.getSku);

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});