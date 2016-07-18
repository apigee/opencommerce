var express = require('express');
var bodyparser = require('body-parser');

var routes = require('./routes/routes.js');

var app = express();
app.use(bodyparser.json());

app.get('/:collection_id', routes.getCollection);

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});