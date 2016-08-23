var request = require('request');
var pkginfo = require('../package');

products = {};
module.exports = products;

var basePath = pkginfo.baasBasePath;
products.getProduct = function (productId, callback)
{
    var url = basePath +"/products/"+ productId;//adding relevent product ID

//first request to fetch the product
    request({
        method: 'GET',
        uri: url
    }, function (error, response, body)
    {
        errorobj={};
        if (!error && response.statusCode == 200)
        {
            var product = assignResponseForProduct(JSON.parse(body));

//second request to fetch the sku's associated with the product
            request({
                method: 'GET',
                uri: url + "/isinstanceof"
            }, function (err, res, bdy)
            {
                errobj={};
                if ((!err && res.statusCode == 200)||(res.length==0 && res.statusCode==200) )
                {
                    var skus = assignResponseForSku(JSON.parse(bdy), productId);
                    addItem(product, "skus", skus);//skus

                    callback(null, product);
                }
                else if(res.statusCode==401)
                {
                    errobj.code=res.statusCode;
                    errobj.msg="UnAuthorised access";
                    callback(errobj,null);
                }

                else if(res.statusCode==404)
                {
                    //no skus for the product, but the product exists
                    var skus=[];
                    addItem(product,"skus",skus);
                    callback(null,product);
                }

                else
                {
                    errobj.code=res.statusCode;
                    errobj.msg="Something went wrong";
                    callback(errobj, null);

                }
            });

        }
        else if(response.statusCode==401)
        {
            errorobj.code=response.statusCode;
            errorobj.msg="Unauthorised access";
            callback(errorobj,null);
        }
        else if(response.statusCode==404)
        {
            errorobj.code=response.statusCode;
            errorobj.msg="Product Not Found";
            callback(errorobj,null);
        }
        else if(response.statusCode==400)
        {
            errorobj.code=response.statusCode;
            errorobj.msg="Bad Request";
            callback(errorobj,null);
        }
        else
        {
            errorobj.code=response.statusCode;
            errorobj.msg="Something went wrong";
            callback(errorobj,null);

        }
    });
};

products.getProductSkus = function (productId, filter, cursor, limit, callback) {
    var url = basePath +"/products/"+ productId;//adding reelevent product ID

    var options = {
        method: 'GET',
        uri: url + "/isinstanceof",
        qs: {
            "ql": filter,
            "cursor": cursor,
            "limit": limit
        }
    };

//Direct request to fetch the sku's associated with the product
    request(options, function (err, res, bdy)
    {
        errorobj={};
        if (!err && res.statusCode == 200) {
            var resObj = {};
            var skus = assignResponseForSku(JSON.parse(bdy));
            resObj.skus = skus;
            resObj.count = skus?(skus.length||0):0;
            resObj.page_hint = JSON.parse(bdy).cursor;
            callback(null, resObj);
        }

        else if(res.statusCode==401)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Unauthorised access";
            callback(errorobj,null);
        }
        else if(res.statusCode==404)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Product Not Found";
            callback(errorobj,null);
        }
        else if(res.statusCode==400)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Bad Request";
            callback(errorobj,null);
        }
        else
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Something went wrong";
            callback(errorobj,null);

        }
    });
};


products.getSku = function (productId, skuId, callback)
{
    var url = basePath +"/products/"+ productId + "/isinstanceof" + "/skus/" ;//adding reelevent sku ID

//Direct request to fetch the sku's associated with the product
    request({
        method: 'GET',
        uri: url
    }, function (err, res, bdy)
    {
        errorobj={};
        if (!err && res.statusCode == 200)
        {
            request({
                method: 'GET',
                uri: url  + skuId
            }, function (err, res, bdy)
            {
                errobj={};
                if ((!err && res.statusCode == 200)||(res.length==0 && res.statusCode==200) )
                {

                    var skus = assignResponseForSku(JSON.parse(bdy));
                    callback(null, skus[0]);

                }
                else if(res.statusCode==401)
                {
                    errobj.code=res.statusCode;
                    errobj.msg="UnAuthorised access";
                    callback(errobj,null);
                }

                else if(res.statusCode==404)
                {
                    //no skus for the product, but the product exists
                    errobj.code=res.statusCode;
                    errobj.msg="Sku Not Found";
                    callback(errobj, null);
                }
                else if(JSON.parse(bdy).error)
                {
                    errobj.code=404;
                    errobj.msg="Sku Not Found";
                    callback(errobj,null);

                }

                else
                {
                    errobj.code=res.statusCode;
                    //console.log(JSON.parse(bdy));
                    errobj.msg=res.msg;
                    callback(errobj, null);

                }
            });



        }
        else if(res.statusCode==401)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Unauthorised access";
            callback(errorobj,null);
        }
        else if(res.statusCode==404)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Product Not Found";
            callback(errorobj,null);
        }
        else if(res.statusCode==400)
        {
            errorobj.code=res.statusCode;
            errorobj.msg="Bad Request";
            callback(errorobj,null);
        }
        else
        {
            errorobj.code=res.statusCode;
            errorobj.msg="1 Something went wrong";
            callback(errorobj,null);

        }
    });
};


function assignResponseForProduct(results) {
    var resObj = {};

    if (results.entities[0]) {
        var result = results.entities[0];
        addItem(resObj, "id", result.name);
        addItem(resObj, "name", result.product_name);
        addItem(resObj, "short_description", result.short_description);
        addItem(resObj, "long_description", result.short_description);
        addItem(resObj, "images", result.images);
        addItem(resObj, "categories", result.category);
        addItem(resObj, "attributes", result.attributes);//attributes
        addItem(resObj, "vendor", result.vendor);//vendor
        addItem(resObj, "reviews", result.reviews);//reviews
        addItem(resObj, "rating", result.rating);//rating
        addItem(resObj, "overall_rating", result.overall_rating);//overall_rating
        return resObj;
    }
    else
        return []

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