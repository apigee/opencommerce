var express = require('express');
var bodyparser = require('body-parser');

var routes = require('./routes/routes.js');

var app = express();
app.use(bodyparser.json());

// cart related

//app.get('/:cart_id', routes.getCart);
// GET carts details
app.get('/:cart_id', routes.getCart);
// POST create a new cart
app.post('/', routes.createCart);
// PUT create a new cart
app.put('/:cart_id', routes.editCart);
// DELETE delete the cart
app.delete('/:cart_id', routes.deleteCart);

// items related

// POST add items to cart
app.post('/:cart_id/items', routes.addItem);
// PUT edit items in cart
app.put('/:cart_id/items', routes.editItem);
// DELETE delete items from cart
app.delete('/:cart_id/items', routes.deleteItem);


app.listen(3000, function() {
    console.log('App listening on port 3000!');
});