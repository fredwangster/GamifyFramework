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
		
		findOrCreate: {
			require:		['data','type'],
			auth:			'sys',
			description:	"Find or create a user account",
			params:			{data:"Object", type:"Type of account", property:'The name of the unique property to identify the user'},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				if (!params.property) {
					params.property = 'id';	// Default, most common one
				}
				
				var query = {};
				if (req.user) {
					query.id = req.user.id;
				} else {
					query['profile.'+params.type+'.'+params.property] = params.data[params.property];
				}
				
				
				scope.mongo.find({
					collection:	'users',
					query:	query
				}, function(response) {
					
					var newUser;
					
					if (response.length == 0) {
						// Create
						newUser 	= true;
						
						var user 	= {
							id:		scope.Gamify.crypto.md5(scope.Gamify.uuid.v4()),
							apikey:	scope.Gamify.crypto.md5(scope.Gamify.uuid.v4()),
							secret:	scope.Gamify.crypto.md5(scope.Gamify.uuid.v4()),
							points:	{
								total:		0,
								log:		[]
							},
							stats:	{
								clicks:		0,
								views:		0,
								referrals:	0
							},
							email:	params.data.email
						};
						
						if (req.cookies['track_referrer']) {
							user.referrer	= req.cookies['track_referrer'];
							
							// Increment the referrer's referral count
							Gamify.data.queue.registerReferral(user.referrer, req, res);
							
							// Increment the points
							Gamify.data.queue.updatePoints(user.referrer, 'referral');
						}
						
					} else {
						// Update
						newUser 	= false;
						var user 	= response[0];
					}
					
					var updateData 					= {};
					updateData.$set 				= {};
					
					params.data.accessToken 	= params.accessToken;
					params.data.refreshtoken 	= params.refreshtoken;
					
					updateData.$set['profile.'+params.type] 	= params.data;
					
					if (newUser) {
						var p;
						for (p in user) {
							updateData.$set[p] = user[p];
						}
					}
					
					if (params.data.name && params.data.name.familyName) {
						if (!user.lastname) {
							updateData.$set.lastname = params.data.name.familyName;
						}
					}
					if (params.data.name && params.data.name.givenName) {
						if (!user.lastname) {
							updateData.$set.firstname = params.data.name.givenName;
						}
					}
					if (params.data.gender) {
						if (!user.gender) {
							updateData.$set.gender = params.data.gender;
						}
					}
					// Update
					scope.mongo.update({
						collection:	"users",
						query:		query,
						data:		updateData
					}, function(a, b) {
						scope.mongo.find({
							collection:	"users",
							query:		params.query
						}, function(response2, err) {
							callback(response2[0]);
							
							if (newUser) {
								// Give points for signing up
								Gamify.data.queue.updatePoints(response2[0].id, 'signup');
							}
							
						});
					});
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