var cart = require('../libs/cart.js')
var apigee = require('apigee-access');

Routes = {};
module.exports = Routes;

Routes.getCart = function(req, res) {
    var params = {};

    params.cart_id = req.params.cart_id;

    console.log('GET cart');

    cart.getCart(params, function(err, data) {
        if (err){
            res.statusCode = 404;
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data); 
        }
    });
};

Routes.createCart = function(req, res) {
    var params = {};

    params.cart_details = req.body.cart_details;

    console.log('POST cart');

    cart.createCart(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};

Routes.editCart = function(req, res) {
    var params = {};

    params.cart_id = req.params.cart_id;
    params.cart_details = req.body.cart_details;

    console.log('PUT cart');

    cart.editCart(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};

Routes.deleteCart = function(req, res) {
    var params = {};

    params.cart_id = req.params.cart_id;

    console.log('GET cart');

    cart.deleteCart(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};

Routes.addItem = function(req, res) {
    var params = {};
    params.cart_id = req.params.cart_id;
    params.items = req.body.cart_items;

    console.log('POST items to cart');

    cart.addItem(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};

Routes.deleteItem = function(req, res) {
    var params = {};
    params.cart_id = req.params.cart_id;
    params.items = req.body.cart_items;

    console.log('DELETE items from cart');

    cart.deleteItem(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};

Routes.editItem = function(req, res) {
    var params = {};
    params.cart_id = req.params.cart_id;
    params.items = req.body.cart_items;

    console.log('PUT edit items in cart');

    cart.editItem(params, function(err, data) {
        if (err){
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};
