var request = require('request');
var pkginfo = require('../package');
var util = require('commerce_utils');

Order = {};

var basePath = pkginfo.baasBasePath;

var headers = { 
    //"Content-Type" : "application/x-www-form-urlencoded",
};



Order.getAllOrders = function(params, callback) {
	var status = params.status;
	var limit = params.limit;
	var pageHint = params.page_hint;
	var username = params.username;

	console.log('GET : orders : ' + JSON.stringify(params));

	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('orders');
	if (limit)
		genurl.addLimit(limit);
	if (pageHint)
		genurl.addPageHint(pageHint);
//	if (username)
//		genurl.addQL('');

	// get the generated URL
	url = genurl.getUrl();

	console.log('GET : ' + url);

	request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
		if(error){
			console.log('GET : Error - ' + error);
			callback(error);
		} else {
			console.log('GET : Response from orders - ' + body);
			var body_obj = JSON.parse(body);
			entities_list = body_obj.entities;
			var output = [];
			var tmpObj = {};
			var formated_output;

			for (key in entities_list){
				obj = entities_list[key];
				tmpObj = orderObj(obj.order_number, obj.order_date, obj.sub_total_amount, obj.currency, obj.total_discount, obj.discount_codes, obj.tax_lines, obj.is_tax_applicable, obj.total_amount, obj.updated_at, obj.client_ip, obj.cancel_reason, obj.cancel_date, obj.cart_id, obj.customer_details, obj.payment_details, obj.fulfillment_status, obj.ship_to, obj.is_billing_same_as_shipping, obj.bill_to, obj.order_items, obj.packages);
				output.push(tmpObj);
			}

			formated_output = { items: output,count: body_obj.count, page_hint: body_obj.cursor };
			console.log('GET : output : ' + JSON.stringify(formated_output));
			callback(null, formated_output);
		}

	});
};

Order.getOrder = function(params, callback) {
	var status = params.status;
	var pageHint = params.pageHint;
	var order_id  = params.order_id;

	console.log('GET : orders : ' + JSON.stringify(params));

	// use genurl object to create URL
	genurl = new util.genurl();
	genurl.setBase(basePath);
	genurl.join('orders');
	genurl.join(order_id);
	//genurl.addQL('');

	// get the generated URL
	url = genurl.getUrl();

	console.log('GET : ' + url);

	request({ url : url, method: 'GET', headers: headers }, function(error, response, body){
		if(error){
			console.log('GET : Error - ' + err);
			callback(error);
		} else {
			var obj;
			var formated_output;
			console.log('GET : Response from order - ' + body);
			body_obj = JSON.parse(body);
			if(body_obj.entities.length > 0){
				obj = body_obj.entities[0];
				output = orderObj(obj.order_number, obj.order_date, obj.sub_total_amount, obj.currency, obj.total_discount, obj.discount_codes, obj.tax_lines, obj.is_tax_applicable, obj.total_amount, obj.updated_at, obj.client_ip, obj.cancel_reason, obj.cancel_date, obj.cart_id, obj.customer_details, obj.payment_details, obj.fulfillment_status, obj.ship_to, obj.is_billing_same_as_shipping, obj.bill_to, obj.order_items, obj.packages);
				formated_output = output;
				callback(null, formated_output);
			} else {
				callback('no order with given order_id');
			}
			
			
		}

	});
};

function orderObj(order_number, order_date, sub_total_amount, currency, total_discount, discount_codes, tax_lines, is_tax_applicable, total_amount, updated_at, client_ip, cancel_reason, cancel_date, cart_id, customer_details, payment_details, fulfillment_status,ship_to,is_billing_same_as_shipping,bill_to,order_items,packages){
	var obj = {};

	obj.order_number = order_number;
	obj.order_date = order_date;
	obj.sub_total_amount = sub_total_amount;
	obj.currency = currency;
	obj.total_discount = total_discount;
	obj.discount_codes = discount_codes;
	obj.tax_lines = tax_lines;
	obj.is_tax_applicable = is_tax_applicable;
	obj.total_amount = total_amount;
	obj.updated_at = updated_at;
	obj.client_ip = client_ip; 
	obj.cancel_reason = cancel_reason;
	obj.cancel_date = cancel_date; 
	obj.cart_id = cart_id; 
	obj.customer_details = customer_details;
	obj.payment_details = payment_details; 
	obj.fulfillment_status = fulfillment_status;
	obj.ship_to = ship_to;
	obj.is_billing_same_as_shipping = is_billing_same_as_shipping;
	obj.bill_to = bill_to; 
	obj.order_items = order_items;
	obj.packages = packages;

	return obj;
}

module.exports = Order;