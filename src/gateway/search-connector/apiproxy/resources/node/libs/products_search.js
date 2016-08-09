var request = require('request');
var pkginfo = require('../package');

products_search = {};
module.exports = products_search;

var basePath = pkginfo.baasBasePath;
var authInHeader = pkginfo.authInHeader;


products_search.searchProducts = function (product_filter, sku_filter, cursor, limit, category, collection, callback) {
    var url = basePath; //adding relevent product ID
    if (ispresent(product_filter))
    {
        product_filter = " and " + product_filter;
    }
    else
        product_filter = "";

    if (ispresent(category)) {
        product_filter += " and category = '" + category + "'";
    }

    if (collection) {
        url += '/collections/' + collection + "/issetof;ql=where type='product' " + product_filter + "/isinstanceof";
        var options = {
            method: 'GET',
            uri: url,

            qs: {
                "ql": sku_filter,
                "cursor": cursor,
                "limit": limit
            }
        };
        //request to fetch the skus based on the search results
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200)
            {
                var skus = assignResponseForSku(JSON.parse(body));

                callback(null, skus);


            }
            else
            {
                body_obj=JSON.parse(body);

                errorobj={};
                errorobj.code=response.statusCode;
                errorobj.msg=body_obj.error;

                callback(errorobj, null);

            }
        });

    }
    else {

        //there has to a generic request irrespective of search made through collections or through products
        // seperate requests made due to a bug in baas search
        //url += "products;ql=where type='product'" + product_filter + "/isinstanceof";
        //url to be used in case of single request
        url += "/products;ql=where type='product'" + product_filter;

        var options = {
            method: 'GET',
            uri: url,
            qs: {
                "cursor": cursor,
                "limit": limit
            }
        };
//request to fetch the products based on the search results
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200)
            {
                var products = assignResponseForProducts(JSON.parse(body));
                var product_url = basePath + '/products/';
                var len = products.length;
                //syncronous request to fetch the sku's
                var skusList = [];

                if(len>0)
                    requestProductSku(products, sku_filter, skusList, 0, len, callback, JSON.parse(body).cursor);
                else
                    callback(null,[]);
            }
            else
            {
                body_obj=JSON.parse(body);

                errorobj={};
                errorobj.code=response.statusCode;
                errorobj.msg=body_obj.error;

                callback(errorobj, null);

            }
        });
    }

}
;


function requestProductSku(products, sku_filter, skusList, index, len, callback, cursor) {
    request({
        method: 'GET',
        uri: basePath + '/products/' + products[index].id + "/isinstanceof",
        qs: {
            "ql": sku_filter
        }
    }, function (err, res, bdy) {
        if (!err && res.statusCode == 200) {
            var skus = assignResponseForSku(JSON.parse(bdy));
            for (var i in skus)
                skusList.push(skus[i]);
            index += 1;
            if (index < len) {
                requestProductSku(products, sku_filter, skusList, index, len, callback, cursor)
            }
            else {
                var result = {};
                result.skusList = skusList;
                result.cursor = cursor;
                callback(null, result);
            }
        }
        else {
            callback("something went wrong", null);

        }
    });
}

function assignResponseForProducts(results) {
    var resultObj = [];
    for (var i in results.entities) {
        var result = results.entities[i];
        var resObj = {};
        addItem(resObj, "id", result.name);
        addItem(resObj, "name", result.product_name);
        addItem(resObj, "short_description", result.short_description);
        addItem(resObj, "long_description", result.short_description);
        addItem(resObj, "images", result.images);
        addItem(resObj, "category", result.category);
        addItem(resObj, "attributes", result.attributes);//attributes
        addItem(resObj, "vendor", result.vendor);//vendor
        addItem(resObj, "reviews", result.reviews);//reviews
        addItem(resObj, "rating", result.rating);//rating
        addItem(resObj, "overall_rating", result.overall_rating);//overall_rating
        resultObj.push(resObj);
    }
    return resultObj;

}

function assignResponseForSku(results) {
    var res = [];
    for (var i in results.entities) {
        var resObj = {};
        var result = results.entities[i];
        // addItem(resObj, "id", result.uuid);
        addItem(resObj, "name", result.sku_name);
        addItem(resObj, "product_id", result.product_id);
        addItem(resObj, "sku_id", result.name);
        addItem(resObj, "sku_description", result.sku_description);
        addItem(resObj, "inventory_type", result.inventory_type);
        addItem(resObj, "available_quantity", result.available_quantity);//available_quantity
        addItem(resObj, "barcode", result.barcode);//barcode
        addItem(resObj, "price", result.price);//price
        addItem(resObj, "currency", result.currency);//currency
        addItem(resObj, "discount", result.discount);//discount
        addItem(resObj, "total_price", result.price);//price
        addItem(resObj, "attributes", result.attributes);//attributes
        addItem(resObj, "image", result.images);//images
        addItem(resObj, "created_date", result.created_date);//created_date
        addItem(resObj, "expiry_date", result.expiry_date);//expiry_date
        addItem(resObj, "product_url", "/products/" + result.product_id);//url
        res.push(resObj);

    }
    return res;

}

function addItem(Obj, name, prop) {
    if (prop && typeof prop != 'undefined') {
        Obj[name] = prop;
    }
    else {
        Obj[name] = "";
    }
}

function ispresent(Obj) {
    if (Obj && typeof Obj != 'undefined') {
        return true;
    }
    else {
        return false;
    }
}
