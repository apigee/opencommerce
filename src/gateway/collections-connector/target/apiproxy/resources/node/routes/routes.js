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
            res.send(err);
        }
        else {
            res.statusCode = 200;
            res.send(data);
        }
    });
};
