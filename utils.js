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

exports.__request = __request;