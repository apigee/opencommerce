/**
 * Created by rrai on 23/06/16.
 */
var request = require('request');
var pkginfo = require('../package');

skus = {};
module.exports = skus;

var basePath = pkginfo.baasBasePath;
function assignResponse(body)
{
    var json=JSON.parse(body);
    var formattedJson={};


    formattedJson.id=json.entities[0].name;
    formattedJson.name=json.entities[0].sku_name;
    formattedJson.product_id=json.entities[0].product_id;
    formattedJson.sku_id=json.entities[0].name;
    formattedJson.sku_description=json.entities[0].sku_description;
    formattedJson.inventory_type=json.entities[0].inventory_type;
    formattedJson.available_quantity=json.entities[0].available_quantity;
    formattedJson.barcode=json.entities[0].barcode || "";
    formattedJson.price=json.entities[0].price;
    formattedJson.currency=json.entities[0].currency || "";
    formattedJson.discount=json.entities[0].discount;
    formattedJson.total_price=json.entities[0].total_price || "";
    formattedJson.attributes=json.entities[0].attributes || "";
    formattedJson.image=json.entities[0].images;
    formattedJson.created_date=json.entities[0].created_date;
    formattedJson.expiry_date=json.entities[0].expiry_date;
    formattedJson.product_url="/products/" + json.entities[0].product_id;

    return formattedJson;

}


skus.get = function(params, callback)
{
    //form the url
    var url=pkginfo.baasBasePath + "/skus/"+params.skuid;
    //create request object
    request({
        method:'GET',
        uri:url,
        //headers:{"Authorization":"Bearer YWMt6hC8gDkpEeahpY8g1ZSFHgAAAVWgxJgOagbavdxfXXw80gKiAyVToqfIWkc"}//set authorization header
    },function (error, response, body)
    {
        //if no error and the response is a success, return the json
        if (!error && response.statusCode == 200)
        {
            var sku = assignResponse(body);

            callback(null,sku);
        }
        else if(response.statusCode==400)
            {
                callback("Bad Request",null);
            }
        else if(response.statusCode==401)
        {
            callback("UnAuthorized access",null);
        }
        else
        {
            callback("something went wrong",null);

        }
    });


};


