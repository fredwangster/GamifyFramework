/**
* Module dependencies.
*/
var _ 				= require('underscore');
var express 		= require('express');
var http 			= require('http');
var path 			= require('path');
var Gamify 			= require("gamify");	
var _os				= require('os');
var toolset			= require('toolset');
var mime 			= require('mime');
var request 		= require('request');


// Express Middlewares
var flash				= require('express-flash')
var serveFavicon 		= require('serve-favicon');
var morgan 				= require('morgan');
var cookieParser 		= require('cookie-parser');
var multipart 			= require('connect-multiparty');
var methodOverride 		= require('method-override');
var expressSession  	= require('express-session');
var errorHandler 		= require('errorhandler');
var expressCookieauth 	= require('express-cookieauth');
var expressDevice 		= require('express-device');
var exphbs 				= require('express3-handlebars');	//for officially supported express.js rendering engines

// Default options
var options = _.extend({
	online:				true,
	env:				"dev",	// dev or prod
	debug_mode:			false,
	port:				5000,
	db:					"prod",
	mongo_server:		"",
	mongo_login:		"",
	mongo_password:		"",
	mongo_remote:		false,
	mongo_port:			27017
},processArgs());

options.threads			= Math.min(options.threads, _os.cpus().length);
options.cores 			= _os.cpus().length;

var app = express();

// all environments
app.set('port', process.env.PORT || options.port);
app.set('env', options.env);
app.use('/static',express.static(__dirname + '/pages'));

app.use(flash());

// Change your favicon path here
app.use(serveFavicon(__dirname + '/favicon.ico'));
app.use(cookieParser());
app.use(methodOverride());
app.use(expressDevice.capture());


// not really used by Gamify
app.set('view cache', false);
app.disable('view cache');

//for officially supported express.js rendering engines
app.set('views', __dirname+"/pages/views/");
app.engine('handlebars', exphbs({}));
app.set('view engine', 'handlebars');



// development only
if ('dev' == app.get('env')) {
	app.use(errorHandler());
}

// MongoDB settings, from the options
Gamify.settings.mongo 					= {
	server:		options.mongo_server,
	login:		options.mongo_login,
	password:	options.mongo_password,
	port:		options.mongo_port,
	remote:		options.mongo_remote
};
Gamify.settings.db 				= options.db;
Gamify.options 					= options;

// The rendering engine
Gamify.render					= require('rendering').engine;

// The current app directory
Gamify.directory				= path.normalize(__dirname+'/');


Gamify.api.init(app, function() {
	// Start the server
	http.createServer(app).listen(app.get('port'), function(){
		console.log("                       _  __       ");
		console.log("  __ _  __ _ _ __ ___ (_)/ _|_   _ ");
		console.log(" / _` |/ _` | '_ ` _ \\| | |_| | | |");
		console.log("| (_| | (_| | | | | | | |  _| |_| |");
		console.log(" \\__, |\\__,_|_| |_| |_|_|_|  \\__, |");
		console.log(" |___/             Framework |___/ ");
		console.log("");
		console.log('Server listening on port ' + app.get('port'));
	});
});



// Session
app.use(expressSession({
	secret:	'GamifyFramework',
	cookie:	{
		path:	'/',
		maxAge:	1000*60*60*24*14
	},
}));





/*********************************
**********************************
		     _              
		 ___| |_ ___  _ __  
		/ __| __/ _ \| '_ \ 
		\__ \ || (_) | |_) |
		|___/\__\___/| .__/ 
		             |_|    

Do not edit or remove the code after this line!

**********************************
*********************************/





/*************************
**	API ROUTES
**************************/
var apiRoute = function(req, res) {
	var data = {};
	data = _.extend({}, req.body, req.query);
	// Fix the types
	var i;
	for (i in data) {
		if (!isNaN(data[i]*1)) {
			data[i] *= 1;
		}
		if (data[i] == "true") {
			data[i] = true;
		}
		if (data[i] == "false") {
			data[i] = false;
		}
	}
	Gamify.api.execute(req.params.endpoint, req.params.method, data, function() {}, req.params.format, req, res);
}

app.get("/api/:endpoint/:method/:format?", function(req, res){
	apiRoute(req, res);
});
app.post("/api/:endpoint/:method/:format?", multipart(), function(req, res){
	apiRoute(req, res);
});
app.get("/api/", function(req, res){
	res.set("Content-Type", "application/json");
	res.send(200, JSON.stringify({
		name:		"Gamify-Framework Server",
		version:	Gamify.version
	}, null, 4));
});


function processArgs() {
	var i;
	var args 	= process.argv.slice(2);
	var output 	= {};
	for (i=0;i<args.length;i++) {
		var l1	= args[i].substr(0,1);
		if (l1 == "-") {
			if (args[i+1] == "true") {
				args[i+1] = true;
			}
			if (args[i+1] == "false") {
				args[i+1] = false;
			}
			if (!isNaN(args[i+1]*1)) {
				args[i+1] = args[i+1]*1;
			}
			output[args[i].substr(1)] = args[i+1];
			i++;
		}
	}
	return output;
};

/************************************/
/************************************/
/************************************/
// Process Monitoring
setInterval(function() {
	process.send({
		memory:		process.memoryUsage(),
		process:	process.pid
	});
}, 1000);

// Crash Management
if (!options.debug_mode) {
	process.on('uncaughtException', function(err) {
		console.log("err",err);
	});
}