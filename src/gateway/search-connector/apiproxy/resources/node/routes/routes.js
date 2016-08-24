var products_search = require('../libs/products_search.js')

routes = {};
module.exports = routes;


routes.searchProducts = function (req, res) {
    var product_filter = req.query.product_filter;
    var sku_filter = req.query.sku_filter;
    var cursor = req.query.page_hint;
    var limit = req.query.limit;
    var category = req.query.category;
    var collection = req.query.collection_name;
    products_search.searchProducts( product_filter, sku_filter, cursor, limit, category, collection,  function (err, data) {
        if (err) {
            res.status(err.code).send(
                JSON.stringify(err, undefined, 2));
        }
        else {
            res.send(data);
        }
    });
};

