var _ 					= require('underscore');
var qs 					= require("querystring");

// Users
function api() {
	
}
api.prototype.init = function(Gamify, callback){
	var scope = this;
	
	this.Gamify = Gamify;
	
	
	// Return the methods
	var methods = {
		
		// I only keep one method:
		// This was our first example. Let's put the authentication on it.
		// First, we try without authentication.
		world: {
			require:		[],
			auth:			'testAuth',	// Simply copy-paste the name of the authentication method and you're set!
			description:	"A new /hello/world api method",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// From the browser: /api/hello/world
				
				callback({
					hello:	'world',
					userId:	params.__auth	// Remember that's a special property that extends the params if the authentication succeed.
				});
			}
		}
		
	};
	
	// Init a connection
	this.mongo	= new this.Gamify.mongo({database:Gamify.settings.db});
	this.mongo.init(function() {
		callback(methods);
	});
}
exports.api = api;