var order = require('../libs/order.js')
var apigee = require('apigee-access');

Routes = {};
module.exports = Routes;

Routes.getAllOrders = function(req, res) {
    var params = {};

    params.status = req.query.status;
    params.limit = req.query.limit;
    params.pageHint = req.query.page_hint;
    params.username=req.query.username;

    console.log('GET for all orders');

    order.getAllOrders(params, function(err, data) {
        if (err)
        {
            res.send({'message': err});
        }
        else {
            res.statusCode = 200;

            res.send(data);
        }
    });
};


Routes.getOrder = function(req, res) {
    var params = {};

    params.status = req.query.status;
    params.order_id = req.params.order_id;
    params.username = req.params.username;

    console.log('GET order');

    order.getOrder(params, function(err, data) {
        if (err){
            res.status(err.code).send(JSON.stringify(err, undefined, 2));
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};
