var request = require('request');
var pkginfo = require('../package');
var util = require('commerce_utils');
var async = require('async');

Cart = {};

var basePath = pkginfo.baasBasePath;

var headers = { 
    "Content-Type" : "application/json"
};

Cart.getCart = function(params, callback) {
	var cart_id  = params.cart_id;

	console.log('GET : carts : ' + JSON.stringify(params));

	var cart_items;
	var cart_item_details;

	async.parallel(
		[	// first async function
    		function(cb){

				// use genurl object to create URL
				genurl = new util.genurl();
				genurl.setBase(basePath);
				genurl.join('carts');
				genurl.join(cart_id);

				// get the generated URL
				url = genurl.getUrl();

				console.log('GET : ' + url);

				request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
					if(error){
						console.log('GET : Error - ' + err);
						cb(error);
					} else {
						//console.log('GET : Response from cart - ' + body);
						var body_obj = JSON.parse(body);
						if(body_obj.error){
							console.log('GET : Error - ' + body_obj.error);
							cb(body_obj.error);
						} else {
							var obj = JSON.parse(body).entities[0];
							cart_items = cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid);
							cb();
						}
					}

				});
			},
			// second async function
			function(cb){

				// use genurl object to create URL
				genurl = new util.genurl();
				genurl.setBase(basePath);
				genurl.join('carts');
				genurl.join(cart_id);
				genurl.join('contains');

				// get the generated URL
				url = genurl.getUrl();

				console.log('GET : ' + url);

				request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
					if(error){
						console.log('GET : Error - ' + err);
						cb(error);
					} else {
						//console.log('GET : Response from cart connection - ' + body);
						cart_item_details = JSON.parse(body).entities;
						cb();
					}
				});
			}
		],
		// callback called after both the above functions are done ie c(); this fucntion is called  only once!
		function(err, results) {
			if(err){
				callback(err);
			} else {
				var formated_output = cart_items;
				for(index in cart_items.cart_items){
					for (tmp_index in cart_item_details){
						if(cart_items.cart_items[index].sku_id == cart_item_details[tmp_index].name){
							formated_output.cart_items[index] = cartItemObj(cart_item_details[tmp_index].name, cart_item_details[tmp_index].name, cart_item_details[tmp_index].sku_url, cart_item_details[tmp_index].price, cart_item_details[tmp_index].currency, cart_item_details[tmp_index].discount, cart_item_details[tmp_index].total_price, cart_item_details[tmp_index].image, cart_items.cart_items[index].quantity);
							continue;
						}
					}
				}
				callback(null, formated_output);
			}
   		}
   	);
};
//cartItemObj(cart_item_details[tmp_index].uuid, cart_item_details[tmp_index].name, cart_item_details[tmp_index].sku_url, cart_item_details[tmp_index].price, cart_item_details[tmp_index].currency, cart_item_details[tmp_index].discount, cart_item_details[tmp_index].total_price, cart_item_details[tmp_index].image, cart_items.cart_items[index].quantity);
Cart.createCart = function(params, callback){
	console.log('POST : carts : ' + JSON.stringify(params));

	var cart_details = params.cart_details;

	var session_id = cart_details.session_id;
	var cart_items = cart_details.cart_items;
	var total_base_price = cart_details.total_base_price;
	var total_discount = cart_details.total_discount;
	var total_price = cart_details.total_price;
	var user_id = cart_details.user_id;
	var created_at = cart_details.created_at;
	var updated_at = cart_details.updated_at;


	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('carts');

	// get the generated URL
	url = genurl.getUrl();

	console.log('POST : ' + url);

	var cartName;

	if(!session_id){
		callback('session_id not passed');
		return
	}
	if(!cart_items){
		cart_items = [];
	}

	requestData = cartObj(session_id, cart_items,total_base_price, total_discount, total_price, user_id,created_at, updated_at);

	console.log('POST data: ' + JSON.stringify(requestData));

	request({ url : url, method: 'POST', headers: headers, body: JSON.stringify(requestData) }, function(error, response, body){
		if(error){
			console.log('POST : Error - ' + err);
			callback(error);
		} else {
			console.log('POST : Response from cart - ' + body);
			var obj = JSON.parse(body).entities[0];
			callback(null, cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid ));
		}
	});
	
};

Cart.editCart = function(params, callback){
	console.log('PUT : carts : ' + JSON.stringify(params));
	var cart_id  = params.cart_id;
	var cart_details = params.cart_details;
	
	var session_id = cart_details.session_id;
	var cart_items = cart_details.cart_items;
	var total_base_price = cart_details.total_base_price;
	var total_discount = cart_details.total_discount;
	var total_price = cart_details.total_price;
	var user_id = cart_details.user_id;
	// created_at,updated_at timestamp in Seconds
	if(!(created_at = cart_details.created_at))
		var created_at = Math.floor( (new Date()).getTime() / 1000 );

	if(!(updated_at = cart_details.updated_at))
		var updated_at = Math.floor( (new Date()).getTime() / 1000 );


	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('carts');
	genurl.join(cart_id);

	// get the generated URL
	url = genurl.getUrl();

	console.log('PUT : ' + url);

	var cartName;

	if(!session_id){
		callback('session_id not passed');
		return
	}
	if(!cart_items){
		cart_items = [];
	}

	requestData = cartObj(session_id, cart_items,total_base_price, total_discount, total_price, user_id,created_at, updated_at);

	console.log('PUT data: ' + JSON.stringify(requestData));

	request({ url : url, method: 'PUT', headers: headers, body: JSON.stringify(requestData) }, function(error, response, body){
		if(error){
			console.log('PUT : Error - ' + err);
			callback(error);
		} else {
			console.log('PUT : Response from cart - ' + body);
			var obj = JSON.parse(body).entities[0];
			callback(null, cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid));
		}
	});
	
};

Cart.deleteCart = function(params, callback) {
	var cart_id  = params.cart_id;

	console.log('GET : carts : ' + JSON.stringify(params));

	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('carts');
	genurl.join(cart_id);

	// get the generated URL
	url = genurl.getUrl();

	console.log('GET : ' + url);

	request({ url : url, method: 'DELETE', headers: headers }, function(error, response, body){
		if(error){
			console.log('GET : Error - ' + err);
			callback(error);
		} else {
			console.log('GET : Response from cart - ' + JSON.stringify(body));
			var body_obj = JSON.parse(body);
			if(body_obj.error){
				console.log('GET : Error - ' + body_obj.error);
				callback({message : body_obj.error});
			} else {
				var obj = body_obj.entities[0];
				output = cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid);
				callback(null, output);
			}
		}

	});
};

Cart.addItem = function(params, callback){
	self = this;

	console.log('POST : item to carts : ' + JSON.stringify(params));
	var cart_id = params.cart_id;
	var items = params.items;

	var genurl = new util.genurl();

	async.each(
		// list to be iterated on
		items,
		// function to be called on each item
		function(value, cb) {
			genurl.clear();
			genurl.setBase(basePath);
			genurl.join('carts');
			genurl.join(cart_id);
			genurl.join('contains');
			genurl.join('skus');
			genurl.join(value.sku_id);
			var url = genurl.getUrl();

			console.log('POST : ' + url);
			request({ url : url, method: 'POST', headers: headers}, function(error, response, body){
				if(error || JSON.parse(body).error){
					console.log('POST for connection of items : Error - ' + body);
					cb(body);
					return
				} else {
					cb();
					return
				}
			});	
		},
		// callback called after iterating through all elements
		function (err) {
			if(err) {
				callback(err);
				return
			} else {
				console.log('POST item to cart making GET first');
				self.getCart({'cart_id': cart_id}, function(err, output){
					if(err){
						callback('wrong cart id ');
					} else {
						oldCart = JSON.parse(JSON.stringify(output));
						// creating new object to update back
						var newCart = oldCart;
						var item_found = false;
						for (itemindex in items){
							var sku_id = items[itemindex].sku_id;
							var quantity = items[itemindex].quantity;
							for(index in newCart.cart_items){
								if(newCart.cart_items[index].sku_id == sku_id){
									item_found = true;
									newCart.cart_items[index].quantity = quantity;
									break;
								}
							}
							if(!item_found){
								newCart.cart_items.push({'sku_id': sku_id, 'quantity': quantity});	
							}
						}
						var requestData = newCart;
						
						console.log('PUT data: ' + JSON.stringify(requestData));
						
						genurl = new util.genurl();
						genurl.setBase(basePath);
						genurl.join('carts');
						genurl.join(cart_id);
						url = genurl.getUrl();

						console.log('PUT : ' + url);
						request({ url : url, method: 'PUT', headers: headers, body: JSON.stringify(requestData)}, function(error, response, body){
							if(error){
								console.log('PUT : Error - ' + err);
								callback(error);
								return
							} else {
								console.log('PUT : Response from cart - ' + JSON.stringify(body));
								var obj = JSON.parse(body).entities[0];
								output = cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at);
								callback(null, output);
							}
						});	
					}
				});
			}
		}
	);
}


Cart.deleteItem = function(params, callback){
	self = this;
	console.log('DELETE : item from carts : ' + JSON.stringify(params));
	var cart_id = params.cart_id;
	var items = params.items;

	var genurl = new util.genurl();

	async.each(
		// list to be iterated on 
		items,
		// function to be called on each item
		function(value, cb) {
			genurl.clear();
			genurl.setBase(basePath);
			genurl.join('carts');
			genurl.join(cart_id);
			genurl.join('contains');
			genurl.join('skus');
			genurl.join(value.sku_id);
			var url = genurl.getUrl();

			request({ url : url, method: 'DELETE', headers: headers}, function(error, response, body){
				if(error || JSON.parse(body).error){
					console.log('DELETE for connection of items : Error - ' + body);
					cb(body);
					return
				} else {
					cb();
					return
				}
			});	
		},
		// callback called after iterating through all elements
		function (err) {
			if(err) {
				callback(err);
				return
			} else {			
				console.log('PUT item to cart making GET first');
				self.getCart({'cart_id': cart_id}, function(err, output){
					if(err){
						callback('wrong cart id ');
					} else {
						oldCart = JSON.parse(JSON.stringify(output));
						// creating new object to update back
						var newCart = oldCart;
						var item_found = false;
						for (itemindex in items){
							var sku_id = items[itemindex].sku_id;
							var quantity = items[itemindex].quantity;
							for(index in newCart.cart_items){
								if(newCart.cart_items[index].sku_id == sku_id){
									item_found = true;
									newCart.cart_items.splice(index, 1);
									//break;
								}
							}
							if(!item_found){
								callback('item with sku_id '+ sku_id +' not found');
								return	
							}
						}
						var requestData = newCart;
						
						console.log('PUT data: ' + JSON.stringify(requestData));
							
						genurl = new util.genurl();
						genurl.setBase(basePath);
						genurl.join('carts');
						genurl.join(cart_id);
						var url = genurl.getUrl();

						request({ url : url, method: 'PUT', headers: headers, body: JSON.stringify(requestData)}, function(error, response, body){
							if(error){
								console.log('PUT : Error - ' + err);
								callback(error);
								return
							} else {
								console.log('PUT : Response from cart - ' + JSON.stringify(body));
								var obj = JSON.parse(body).entities[0];
								output = cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at);
								callback(null, output);
							}
						});	
					}
				});
			}
		}
	);

}

Cart.editItem = function(params, callback){
	console.log('POST : item to carts : ' + JSON.stringify(params));
	var cart_id = params.cart_id;
	var items = params.items;

	console.log('POST item to cart making GET first');
		this.getCart({'cart_id': cart_id}, function(err, output){
			if(err){
				callback('wrong cart id ');
			} else {
				oldCart = JSON.parse(JSON.stringify(output));
				// creating new object to update back
				var newCart = oldCart;
				var item_found = false;
				for (itemindex in items){
					var sku_id = items[itemindex].sku_id;
					var quantity = items[itemindex].quantity;
					for(index in newCart.cart_items){
						if(newCart.cart_items[index].sku_id == sku_id){
							item_found = true;
							newCart.cart_items[index].quantity = quantity;
							break;
						}
					}
					if(!item_found){
						callback('item with sku_id '+ sku_id +' not found');
						return	
					}
				}
				var requestData = newCart;
				
				console.log('PUT data: ' + JSON.stringify(requestData));
				
				genurl = new util.genurl();
				genurl.setBase(basePath);
				genurl.join('carts');
				genurl.join(cart_id);
				var url = genurl.getUrl();

				request({ url : url, method: 'PUT', headers: headers, body: JSON.stringify(requestData)}, function(error, response, body){
					if(error){
						console.log('PUT : Error - ' + err);
						callback(error);
						return
					} else {
						console.log('PUT : Response from cart - ' + JSON.stringify(body));
						var obj = JSON.parse(body).entities[0];
						output = cartObj(obj.session_id, obj.cart_items, obj.total_base_price ,obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at);
						callback(null, output);
					}
				});	
			}
		});

};

function cartObj(session_id, cart_items, total_base_price, total_discount, total_price, user_id, created_at, updated_at, cart_id){
	var obj = {};
	
	if(!session_id)
		session_id = "";
	if(!cart_items)
		cart_items = "";
	if(!total_base_price)
		total_base_price = "";
	if(!total_discount)
		total_discount = "";
	if(!total_price)
		total_price = "";
	if(!user_id)
		user_id = "";
	if(!created_at)
		created_at = "";
	if(!updated_at)
		updated_at = "";

	obj.session_id = session_id;
	obj.cart_items = cart_items;
	obj.total_base_price = total_base_price;
	obj.total_discount = total_discount;
	obj.total_price = total_price;
	obj.user_id = user_id;
	obj.created_at = created_at;
	obj.updated_at = updated_at;
	obj.cart_id = cart_id;

	return obj;
}


function cartItemObj(sku_id, name, sku_url, price, currency, discount, total_price, image, quantity){
	var obj = {};

	obj.sku_id = sku_id; 
	obj.name = name;
	obj.sku_url = sku_url;
	obj.price = price;	
	obj.currency = currency; 
	obj.discount = discount; 
	obj.total_price = total_price;
	obj.image = image; 
	obj.quantity = quantity;

	return obj;

}
module.exports = Cart;