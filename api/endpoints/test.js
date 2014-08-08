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
		
		hello: {
			require:		[],
			auth:			false,
			description:	"A test API call",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// From the browser: /api/test/hello
				
				callback({
					hello:	'world'
				});
			}
		},
		
		withparams: {
			require:		['word'],
			auth:			false,
			description:	"A test API call",
			params:			{word: 'A parameter that will be returned as output.'},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// From the browser: /api/test/withparams?word=hello
				
				callback({
					entered:	params.word
				});
			}
		},
		
		withtypecast: {
			require:		['somearray','someint','somebool','someobject'],
			auth:			false,
			description:	"A test API call",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// Gamify.api.fixTypes() allow to typecast variables instead of getting them as strings
				params	= Gamify.api.fixTypes(params, {
					somearray:		'array',
					somenumber:		'number',
					somebool:		'bool',
					someobject:		'object'
				});
				
				// From the browser: /api/test/withtypecast?somearray=[0,1,2]&someint=1234&somebool=true&someobject={"hello":"world"}
				
				callback({
					parameters: params
				});
			}
		},
		
		withouttypecast: {
			require:		['somearray','someint','somebool','someobject'],
			auth:			false,
			description:	"A test API call",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				// Here we don't use any typecasting. Compare to the output of /api/test/withtypecast
				
				// From the browser: /api/test/withouttypecast?somearray=[0,1,2]&someint=1234&somebool=true&someobject={"hello":"world"}
				
				callback({
					parameters: params
				});
			}
		},
		

		//returns an error message
		errormessage: {
			require:		[],
			auth:			false,
			description:	"A test API call",
			params:			{},
			status:			'dev',
			version:		1.0,
			callback:		function(params, req, res, callback) {
				
				callback(Gamify.api.errorResponse("This is an error message"));
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