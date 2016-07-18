var request = require('request');
var pkginfo = require('../package');

location = {};
module.exports = location;

var basePath = pkginfo.baasBasePath;
var authInHeader = pkginfo.authInHeader;
location.searchNearBy = function (postal_codezip_code, city, nearby, callback) {

    var url = basePath + "/stores/";
    var filter;

    if (postal_codezip_code) {
        if (city) {
            if (nearby.distance) {
                filter = "where adr.zip = '" + postal_codezip_code + "' and adr.city='" + city + "' and location within " + nearby.distance + " of " + nearby.latitude + " , " + nearby.longitude;

            }
            else {
                filter = "where adr.zip = '" + postal_codezip_code + "' and adr.city='" + city + "'";

            }

        }
        else if (nearby.distance) {

            filter = "where adr.zip = '" + postal_codezip_code + "' and location within " + nearby.distance + " of " + nearby.latitude + " , " + nearby.longitude;

        }
        else {
            filter = "where adr.zip = '" + postal_codezip_code + "'";
        }
    }
    else if (city) {
        if (nearby.distance) {
            filter = "where location within " + nearby.distance + " of " + nearby.latitude + " , " + nearby.longitude + " and adr.city='" + city + "' ";

        }
        else {
            filter = "where  adr.city='" + city + "' ";

        }
    }
    else if (nearby.distance) {
        filter = "where location within " + nearby.distance + " of " + nearby.latitude + " , " + nearby.longitude;

    }
    else {
        filter = null;
    }


    var options = {
        method: 'GET',
        uri: url,
        qs: {
            "ql": filter,
            "limit": 1000
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var stores = assignResponseForStores(JSON.parse(body));
            callback(null, stores);
        }
        else {
            callback("something went wrong", null);
        }
    });
};

location.searchNearByStore = function (storeId, callback) {
    var url = basePath + "/stores/" + storeId;//adding reelevent product ID

    var options = {
        method: 'GET',
        uri: url
    }
//Direct request to fetch the sku's associated with the product
    request(options, function (err, res, bdy) {
        if (!err && res.statusCode == 200) {
            var body = JSON.parse(bdy);
            if (body.entities[0]) {
                var store = assignResponseForStore(JSON.parse(bdy).entities[0]);
                callback(null, store);
            }
            else
                callback(null, {});

        }
        else {
            callback("something went wrong", null);

        }
    });
};

function assignResponseForStore(result) {
    var resObj = {};

    if (result) {
        addItem(resObj, "name", result.name);
        addItem(resObj, "address", result.adr);
        addItem(resObj, "postal_code", result.zip);
        //addItem(resObj, "affiliate", result.affiliate);
        addItem(resObj, "id", result.id);
        addItem(resObj, "category", result.category);
        addItem(resObj, "location", result.location);//attributes
        addItem(resObj, "phone_number", result.phone);//vendor
        //addItem(resObj, "site_type", result.site_type);//reviews
        addItem(resObj, "email", result.email);//reviews
        addItem(resObj, "working_hours", result.working_hours);//reviews
        addItem(resObj, "attributes", result.attributes);//reviews
        addItem(resObj, "comments", result.comments);//reviews
        return resObj;
    }
    else
        return {}

}

function assignResponseForStores(results) {
    var res = [];
    for (var i in results.entities) {
        res.push(assignResponseForStore(results.entities[i]));
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