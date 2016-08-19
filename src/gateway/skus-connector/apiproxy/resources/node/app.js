var express = require('express');
var app = express();

var bodyparser = require('body-parser');
app.use(bodyparser.json());

var routes = require('./routes/routes.js');


// /sku/skuid (getting a specific sku)
app.get('/:skuid', routes.get);


//error APIs
app.get('/',function (req,res)
{
    err={};
    err.code=400;
    err.msg="Bad request Sku Id not specified";
    res.status(err.code).send(JSON.stringify(err, undefined, 2));

});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});