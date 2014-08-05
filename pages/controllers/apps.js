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
		'/': {
			require:		[],
			auth:			false,
			description:	"Prototype",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// Rendering engine
				// Gamify.render(filename, data, callback, Gamify_instance, req, res)
				Gamify.render("pages/views/homepage.html", {}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
			}
		},
		
		'/my/new/page': {
			require:		[],
			auth:			false,
			description:	"a new page for the demo",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				Gamify.render("pages/views/a_new_page.html", {}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
				// done!
			}
		},
		
		// Client-side dependency management demo
		'/dependencies': {
			require:		[],
			auth:			false,
			description:	"Prototype",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// Using the dependency plugin for the rendering engine,
				// you can simply specify what are the names of the libraries to include from the /pages/bower_components/ folder.
				// It will load the required bower dependencies.
				// bower.json *must* include the parameter "main" (example: "main": "./angular.js") for it to work,
				// else, the dependency plugin can't figure out by itself which file to include.
				
				
				Gamify.render("pages/views/dependencies.html", {
					dependencies:	['jquery','bootstrap']
				}, function(rendered) {
					callback(rendered);
				}, Gamify, res, req);
				
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