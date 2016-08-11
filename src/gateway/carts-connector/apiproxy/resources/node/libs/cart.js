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

				request({ url : url, method: 'GET', headers: headers }, function(error, response, body)
				{
					errorobj={};

					if(error)
					{
						console.log('GET : Error - ' + err);
						errorobj.code=500;
						errorobj.msg=error.message;
						cb(errorobj);
					}
					else {
						//console.log('GET : Response from cart - ' + body);
						var body_obj = JSON.parse(body);
						if(body_obj.error)
						{
							console.log('GET : Error - ' + body_obj.error);
							errorobj.code=response.statusCode;
							errorobj.msg=body_obj.error;
							cb(errorobj);
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

				request({ url : url, method: 'GET', headers: headers }, function(error, response, body)
				{
					errorobj={};
					if(error)
					{
						console.log('GET : Error - ' + err);
						errorobj.code=500;
						errorobj.msg=error.message;
						cb(errorobj);

					}
					else
						{
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
Cart.createCart = function(params, callback) {
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

	if (!session_id) {
		callback('session_id not passed');
		return
	}
	if (!cart_items) {
		cart_items = [];
	}

	cartObjWithCheck(session_id, cart_items, total_base_price, total_discount, total_price, user_id, created_at, updated_at, function (errors, data) {


	console.log('POST data: ' + JSON.stringify(data));
	if (data) {
		request({
			url: url,
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data)
		}, function (error, response, body) {
			if (error) {
				console.log('POST : Error - ' + err);
				callback(error);
			} else {
				console.log('POST : Response from cart - ' + body);
				var obj = JSON.parse(body).entities[0];
				callback(null, cartObj(obj.session_id, obj.cart_items, obj.total_base_price, obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid));
			}
		});
	}
	else
		{
			console.log(errors);
			callback(errors);
		}
	});
	
};

Cart.editCart = function(params, callback)
{
	console.log('PUT : carts : ' + JSON.stringify(params));
	var cart_id = params.cart_id;
	var cart_details = params.cart_details;

	var session_id = cart_details.session_id;
	var cart_items = cart_details.cart_items;
	var total_base_price = cart_details.total_base_price;
	var total_discount = cart_details.total_discount;
	var total_price = cart_details.total_price;
	var user_id = cart_details.user_id;
	// created_at,updated_at timestamp in Seconds
	if (!(created_at = cart_details.created_at))
		var created_at = Math.floor((new Date()).getTime() / 1000);

	if (!(updated_at = cart_details.updated_at))
		var updated_at = Math.floor((new Date()).getTime() / 1000);


	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('carts');
	genurl.join(cart_id);

	// get the generated URL
	url = genurl.getUrl();

	console.log('PUT : ' + url);

	var cartName;

	if (!session_id) {
		callback('session_id not passed');
		return
	}
	console.log("CART!!!!!!!" + JSON.stringify(cart_items));

	if (!cart_items) {
		console.log("No item");
		cart_items = [];
	}
	cartObjWithCheck(session_id, cart_items, total_base_price, total_discount, total_price, user_id, created_at, updated_at, function (errors, data)
	{
		if(data)
		{
			console.log("data="+JSON.stringify(data));
			console.log("errror=\n"+errors);
			console.log("no error!!! in query");

			request({uri: url, method: 'GET', headers: headers}, function (err, res, req) {
				if (!err && res.statusCode == 200)
				{


					console.log('PUT data: ' + JSON.stringify(data));

					request({
						url: url,
						method: 'PUT',
						headers: headers,
						body: JSON.stringify(data)
					}, function (error, response, body) {
						if (error) {

							console.log('PUT : Error - ' + err);
							callback(error);
						} else {
							console.log('PUT : Response from cart - ' + body);
							var obj = JSON.parse(body).entities[0];
							callback(null, cartObj(obj.session_id, obj.cart_items, obj.total_base_price, obj.total_discount, obj.total_price, obj.user_id, obj.created_at, obj.updated_at, obj.uuid));
						}
					});




				}
				else if (res.statusCode == 404) {
					console.log("GET not successfull");

					callback(res.statusCode + " Cart Not Found ", null);
				}
				else {
					callback(err);
				}
			});
		}
		else
		{
			callback(errors);
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


			if (value.sku_id)
			{
				genurl.join(value.sku_id);
			var url = genurl.getUrl();
			console.log('POST : ' + url);
			makeGetCall(value.sku_id, items.indexOf(value), items.length - 1, function (err, res) {

				if (res) {
					console.log("all skus perfect ");
					request({url: url, method: 'POST', headers: headers}, function (error, response, body) {
						if (error) {
							console.log('POST for connection of items : Error - ' + error);
							cb(error);
							return
						}
						else if (JSON.parse(body).error) {
							cb(JSON.parse(body).error);
						}
						else {
							cb();
							return
						}
					});
				}
				else {
					console.log("error" + err);
					cb(err);
					return
				}
			});
		}
		else
			{
				cb("400 Bad request, Sku_id not mentioned");
			}

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
			if(value.sku_id)
			{

				genurl.join(value.sku_id);
				var url = genurl.getUrl();
				makeGetCall(value.sku_id, items.indexOf(value), items.length - 1, function (err, res) {
					if (res) {
						request({url: url, method: 'DELETE', headers: headers}, function (error, response, body) {
							if (error || JSON.parse(body).error) {
								console.log('DELETE for connection of items : Error - ' + error);
								cb(error);
								return
							}
							else if (JSON.parse(body).error) {
								cb(body)
							}
							else {
								cb();
								return
							}
						});
					}
					else {
						cb(err);
					}
				});
			}
			else
			{
				cb("400 Bad request, sku Id not mentioned");
			}
		},
		// callback called after iterating through all elements
		function (err)
		{
			if(err) {
				callback(err);
				return
			}
			else
			{
				console.log('PUT item to cart making GET first');
				self.getCart({'cart_id': cart_id}, function(err, output){
					if(err){
						callback(err);
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
								callback('404 item with sku_id '+ sku_id +' not found');
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

Cart.editItem = function(params, callback)
{
	console.log('POST : item to carts : ' + JSON.stringify(params));
	var cart_id = params.cart_id;
	var items = params.items;

	console.log('POST item to cart making GET first');
		this.getCart({'cart_id': cart_id}, function(err, output){
			if(err)
			{
				console.log(err);
				callback(err);
			}
			else
			{
				console.log("correct cart");
				oldCart = JSON.parse(JSON.stringify(output));

				// creating new object to update back
				var newCart = oldCart;
				var item_found = false;
				for (itemindex in items)
				{

					var sku_id = items[itemindex].sku_id;
					if(!sku_id)
					{
						callback("400 Bad request, Sku Id not mentioned");
						return;
					}
					else {
						var quantity = items[itemindex].quantity;
						for (index in newCart.cart_items) {
							if (newCart.cart_items[index].sku_id == sku_id) {
								item_found = true;
								newCart.cart_items[index].quantity = quantity;
								break;
							}
						}
						if (!item_found) {
							console.log(sku_id + "not found");
							callback('404 item with sku_id ' + sku_id + ' not found');
							return
						}
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
	console.log("obj=\n"+JSON.stringify(obj));

	return obj;
}
cartObjWithCheck=function(session_id, cart_items, total_base_price, total_discount, total_price, user_id, created_at, updated_at, callback)
{
	var obj = {};

	if(!session_id)
		session_id = "";
	if(!cart_items)
	{
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
		//obj.cart_id = cart_id;
		callback(null,obj);
	}
	else
	{
		console.log("CHECK CART!\n");
		checkValidSkew( cart_items,function(ERROR,DATA)
		{
			if(ERROR)
			{
				callback(ERROR,null);
				return;

			}
			else
			{
				console.log("CHECK DONE");
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
				//obj.cart_id = cart_id;
				callback(null,obj);
				return;
			}

		});

	}
	//console.log("CHECK DONE");

}

function checkValidSkew(cart_items,cb)
{
	async.forEach(cart_items,function(item,index,array)
	{
		console.log("EACH ITEM\n"+JSON.stringify(item));
		if(!item.sku_id)
		{
			console.log("N0 sku id ");
			//error=;
			cb("400 Bad Request Sku_id not mentioned",null);
			return;
		}
		else
		{
			console.log("making GET CAll");
			console.log("index="+cart_items.indexOf(item)+"cart length="+cart_items.length);
			makeGetCall(item.sku_id,cart_items.indexOf(item),cart_items.length-1,function(e,d)
			{
				if(e)
				{
					console.log("error returned");
					cb(e);
					return;
				}
				else
				{
					cb(null,d);
					return;
				}

			});



		}

	});
}
function makeGetCall(sku_id,index,last_index,cb)
{
	genurl1 = new util.genurl();
	genurl1.setBase(basePath);
	genurl1.join('skus');
	genurl1.join(sku_id);
	url1 = genurl1.getUrl();
	console.log("2nd url "+url1);
	request({uri:url1,method:'GET'},function(err,res,bdy)
	{
		console.log(res.statusCode + "response#######"+JSON.stringify(bdy));
		if(!err && res.statusCode==200)
		{
			if(index==last_index)
			{

				cb(null,bdy);
				return
			}
			//console.log("response#######"+JSON.stringify(bdy));

		}
		else if(res.statusCode==404)
		{
			console.log("GET not successfull");
			//error=;
			cb("404  Sku_id " +sku_id+" Not Found",null);
			return;
		}
		else if(err)
		{

			//error=err;
			cb(err,null);
			return ;
		}

	});
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