var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

var routes = require('./routes/routes.js');

app.get('/', routes.get);
app.put('/', routes.put);
app.post('/', routes.post);
app.delete('/', routes.delete);
app.search('/', routes.search);


app.listen(3000, function() {
    console.log('App listening on port 3000!');
});