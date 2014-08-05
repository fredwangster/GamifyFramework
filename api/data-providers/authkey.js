var _ 					= require('underscore');
var toolset 			= require("toolset");

exports.dataProvider = function (Gamify) {
	
	Gamify.data.authKey = new (function() {
		
		var scope 			= this;
		
		this.TTL			= 60*60*1000;	// 1H
		
		// This is an example of a short-lived authorization key.
		// The key is short lived.
		// It needs to be extended regularly while in use.
		// This update needs to be done by the editor.
		
		// How to use from Anywhere that has access to a Gamify instance (pretty much anywhere)
		// Gamify.data.authKey.generateFor(user_id, function(authkey, expires) { ... })
		// Gamify.data.authKey.renew(auth_key, user_id, function(authkey, expires) { ... })
		
		
		// Generate a new authKey
		this.generateFor	= function(uid, callback) {
			
			var authKey 	= toolset.crypto.uuid();
			var expires		= new Date(new Date().getTime()+scope.TTL);
			
			scope.mongo.insert({
				collection:		'authkeys',
				data:			{
					created:	new Date(),
					uid:		uid,
					expires:	expires,
					authKey:	authKey
				}
			}, function(err, data) {
				callback(authKey, expires);
			});
		};
		
		
		// Renew an existing/still valid authKey.
		this.renew	= function(authKey, uid, callback) {
			
			// Check if the authKey exists and is still valid
			scope.mongo.count({
				collection:		'authkeys',
				query:			{
					authKey:	authKey,
					uid:		uid,
					expires:	{
						$gte:	new Date()
					}
				}
			}, function(count) {
				if (count === 0) {
					callback(false);
				} else {
					// Key exists. Renew it
					var expires = new Date(new Date().getTime()+scope.TTL);
					scope.mongo.update({
						collection:		'authkeys',
						query:			{
							authKey:	authKey,
							uid:		uid
						},
						data:			{
							$set:	{
								expires:	expires
							}
						}
					}, function() {
						callback(expires);
					});
				}
			});
		};
		
		
		// Validate an authkey, returns the complete authKey data
		this.validate	= function(authKey, callback) {
			
			// Check if the authKey exists and is still valid
			scope.mongo.find({
				collection:		'authkeys',
				query:			{
					authKey:	authKey,
					expires:	{
						$gte:	new Date()
					}
				}
			}, function(response) {
				if (response.length === 0) {
					callback(false);
				} else {
					callback(response[0]);
				}
			});
		};
		
		this.mongo	= new Gamify.mongo({database: Gamify.settings.db});
		this.mongo.init(function() {
			
		});
	})();
};