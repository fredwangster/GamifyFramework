function auth() {
	
}
auth.prototype.init = function(Gamify, callback){
	var scope = this;
	
	this.Gamify = Gamify;
	
	// Return the methods
	var methods = {
		
		
		// System access only
		sys:	function(res, req, params, callback) {
			
			// Are we using a system authtoken?
			if (params.authtoken == Gamify.settings.systoken) {
				callback(params.uid);
			} else {
				callback(false, "You need a system token to call this method.");
			}
		},
		
		// AuthKey
		// Generate an authkey using Gamify.data.authKey.generateFor(user_id, function(authkey, expires) { ... })
		authkey:	function(res, req, params, callback) {
			if (!params.authkey && !req.cookies.auth) {
				callback(false, "You need an authKey to call this method.");
				return false;
			}
			var authkey;
			if (params.authkey){
				authkey = params.authkey;
			}
			if (req.cookies.auth){
				authkey = req.cookies.auth;
			}
			Gamify.data.authKey.validate(authkey, function(data) {
				if (data === false) {
					callback(false, 'The authkey "'+authkey+'" is invalid or expired.');
					return false;
				} else {
					callback(data.uid);
				}
			});
		},
		
		// Just duplicate one of the available methods
		// Rename and edit
		testAuth:	function(res, req, params, callback) {
			// The method will expect a parameter named testToken to be passed
			if (!params.testToken) {
				callback(false, "You need a test token to call this method.");
				return false;
			}
			
			if (params.testToken == 'helloworld') {
				callback(1);	// THis is where you'd pass the real user's ID, based on your database query for example.
			} else {
				callback(false, "Sorry, that token is not valid.");
				// That first parameter is set to false if the authentication fails.
			}
			
		}
	};
	
	// Init a connection
	this.mongo	= new this.Gamify.mongo({database:this.Gamify.settings.db});
	this.mongo.init(function() {
		callback(methods);
	});
}
exports.auth = auth;