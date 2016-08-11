var order = require('../libs/collection.js')
var apigee = require('apigee-access');

Routes = {};
module.exports = Routes;

Routes.getCollection = function(req, res) {
    var params = {};

    params.limit = req.query.limit;
    params.pageHint = req.query.page_hint;
    params.collection_id = req.params.collection_id;

    console.log('GET order');

    order.getCollection(params, function(err, data) {
        if (err){
            res.status(err.code ).send(
                JSON.stringify(err, undefined, 2));
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};
