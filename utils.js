var request = require('request')

/**
 * Handle multiple requests at once
 * @param urls [array]
 * @param callback [function]
 * @requires request module for node ( https://github.com/mikeal/request )
 */
var __request = function (urls, callback) {

	'use strict';

	var results = {}, t = urls.length, c = 0,
		handler = function (error, response, body) {

			if(!error){
				var url = response.request.uri.href;
				// var url_truncated = url.substr(-36,36)
				results[url] = { error: error, response: response, body: body };

				if (++c === urls.length) { callback(results); }
			}
			

		};

	while (t--) { request(urls[t], handler); }
};

function array_unique(arr){
	// from underscore.js
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}
function array_contains(arry, element){
    return arry.indexOf(element) > -1;
};

function array_random_element(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

exports.arrays = {
	contains:array_contains, 
	unique:array_unique,
	random_choice:array_random_element
};
exports.__request = __request;
