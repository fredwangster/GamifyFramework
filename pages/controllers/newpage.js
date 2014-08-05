var _ 					= require('underscore');
var qs 					= require("querystring");

// Users
function page() {
	
}
page.prototype.init = function(Gamify, callback){
	var scope = this;
	
	this.Gamify = Gamify;
	
	// Return the methods
	var paths = {
		
		// The dashboard
		'/hello/world': {
			require:		[],
			auth:			false,
			description:	"My new page",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				
				Gamify.render("pages/views/new_page.html", {}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
				// Done.
				
			}
		}
	};
	
	// Init a connection
	this.mongo	= new this.Gamify.mongo({database:Gamify.settings.db});
	this.mongo.init(function() {
		callback(paths);
	});
}
exports.page = page;