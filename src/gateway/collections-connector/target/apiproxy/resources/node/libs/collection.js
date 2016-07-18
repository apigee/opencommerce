var request = require('request');
var pkginfo = require('../package');
var async = require('async');
var util = require('commerce_utils');

Collection = {};

var basePath = pkginfo.baasBasePath;

var headers = { 
    //"Content-Type" : "application/x-www-form-urlencoded",
};

Collection.getCollection = function(params, callback) {
	var limit = params.limit;
	var pageHint = params.pageHint;
	var collection_id  = params.collection_id;

	console.log('GET : collections : ' + JSON.stringify(params));

	var collection_details;
	var products_details;

	async.parallel(
		[	// first async function
    		function(cb){
    			genurl = new util.genurl();
				genurl.setBase(basePath);
				genurl.join('collections');
				genurl.join(collection_id);

				// get the generated URL
				url = genurl.getUrl();

				console.log('GET : ' + url);

    			request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
					if(error){
						console.log('GET : Error - ' + err);
						callback(error);
					} else {
						console.log('GET : Response from collection - ' + body);
						var body_obj = JSON.parse(body);
						if(body_obj.error){
							console.log('GET : Error - ' + body_obj.error);
							cb(body_obj.error);
						} else {
							var obj = JSON.parse(body).entities[0];
							collection_details = collectionObj(obj.uuid ,obj.name ,obj.collection_description ,obj.image ,[] ,obj.collections ,obj.attributes ,obj.created ,obj.published_status ,obj.published_scope ,obj.expiry_date ,obj.modified);
							cb();
						}
					}
				});
			},
			//second asyc function
    		function(cb){
    			genurl = new util.genurl();
				genurl.setBase(basePath);
				genurl.join('collections');
				genurl.join(collection_id);
				genurl.join('has');

				// get the generated URL
				url = genurl.getUrl();

				console.log('GET : ' + url);

    			request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
					if(error){
						console.log('GET : Error - ' + err);
						callback(error);
					} else {
						console.log('GET : Response from collection products relation - ' + body);
						var body_obj = JSON.parse(body);
						if(body_obj.error){
							console.log('GET : Error - ' + body_obj.error);
							cb(body_obj.error);
						} else {
							var list_obj = JSON.parse(body).entities;
							var products = []
							var product;
							for (product_index in list_obj){
								product = list_obj[product_index];
								products.push(productObj(product.uuid, product.name, product.short_description, product.long_description, product.images, product.category, product.attributes, product.vendor, product.skus, product.reviews, product.ratings, product.overall_rating));
							}
							products_details = products;
							cb();
						}
					}
				});
    		}

		], 

		// callback called after both the above functions are done ie c(); this fucntion is called  only once!
		function(err, results) {
			if(err){
				callback(err);
			} else {
				var formated_output = collection_details;
				formated_output.products = products_details;
				callback(null, formated_output);
			}
   		}
   	);
};

function collectionObj(id, name, collection_description, image, products, collections, attributes, created_date, published_status, published_scope, expiry_date, updated_at){
	var obj = {};

	// obj.id = id;
	obj.name = name;
	obj.collection_description = collection_description;
	obj.image = image;
	obj.products = products;
	obj.collections = collections;
	obj.attributes = attributes;
	obj.created_date = created_date;
	obj.published_status = published_status;
	obj.published_scope = published_scope;
	obj.expiry_date = expiry_date;
	obj.updated_at = updated_at;

	return obj;
}

function productObj(id, name, short_description, long_description, images, category, attributes, vendor, skus, reviews, ratings, overall_rating) {
	var obj = {};
	
	// obj.id = id;
	obj.name = name;	
	obj.short_description = short_description;
	obj.long_description = long_description;
	obj.images = images;	
	obj.category = category;
	obj.attributes = attributes;
	obj.vendor = vendor;
	obj.skus = skus;
	obj.reviews = reviews;
	obj.ratings = ratings;
	obj.overall_rating = overall_rating;

	return obj;
}

module.exports = Collection;