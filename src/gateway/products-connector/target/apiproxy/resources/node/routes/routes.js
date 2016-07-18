var products = require('../libs/products.js')

routes = {};
module.exports = routes;

routes.getProduct = function (req, res) {
    var productId = req.params.productId;
    products.getProduct(productId, function (err, data) {
        if (err) {
            res.status(err.code || 500).send(
                JSON.stringify(err.msg, undefined, 2));
        }
        else {
            res.send(data);
        }
    });
};

routes.getProductSkus = function (req, res) {
    var productId = req.params.productId;
    var filter = req.query.filter;
    var cursor = req.query.page_hint;
    var limit = req.query.limit;
    products.getProductSkus(productId, filter, cursor, limit, function (err, data) {
        if (err) {
            res.status(err.code || 500).send(
                JSON.stringify(err.msg, undefined, 2));
        }
        else {
            res.send(data);
        }
    });
};


routes.getSku = function (req, res) {
    var productId = req.params.productId;
    var skuId = req.params.skuId;
    products.getSku(productId, skuId, function (err, data) {
        if (err) {
            res.status(err.code || 500).send(
                JSON.stringify(err.msg, undefined, 2));
        }
        else {
            res.send(data);
        }
    });
};