# Gamify Framework #

The framework includes 2 main parts:

*   Pages
*   API

## Concept ##

When developing a web application you want the following:

*   Easy to setup new pages
*   Web-services/ APIs
*   Authentication/access restriction on APIs and pages
*   A basic rendering engine

This framework was built on top of ExpressJS and was custom-built for the MEAN stack: MongoDB, ExpressJS & AngularJS.

The rendering engine was custom-made for speed and doesn't include any loop logic. Its only role is to output text and JSON data into a page, and manage and include client-side dependencies (via an included plugin).

The framework provides the server-side processing including apis & authentication while the client-side is typically rendered using AngularJS.

## Install ##
`npm install`

## Structure ##

`/api` contains the API related files, including the data providers, authentication methods and API methods.

`/pages` contains the Page related files, including the static files, controllers and views.

`/main.js` is the main file. It will initialize the threads.

`/process.js` is the code executed by each thread.


## Things to note ##

*   You do not have to do any require() except when using NPM packages. If you ever need to require() a local file, you're doing something wrong.
*   Every controller, auth method, data-provider or API controller receives an instance of the global object `Gamify`.  That object is in part used to share data and methods. Use it. Extend it. It's there for that purpose.


## Pages ##

There are 2 main part to the pages:

`/pages/controllers` contains the controllers.
`/views` contains the views.

This doc will start with the technical specs of each part of the page (controller, view), then show a quick tutorial on how to setup new pages easily in less than a minute.

### Controllers ###
Any JS file you create in the `/pages/controllers` directory will be automatically loaded by the framework.
You don't need to use require() anywhere.

A single file can setup as many pages as you want. You can have one controller file setting up 10 pages, or have 10 controllers each implementing a single page. It's up to you.

However, those files must return data in the proper format.

`exports` must have a property named `page`, which is a function taking 2 arguments `Gamify` and `callback`, and returning a list of paths. Each path also has its own specific format.

If you want to be efficient, simply copy-paste an existing controller and update its content. Don't create new controllers from scratch, it's a waste of time.

Here is an example of page controller:
```
    	'/hello/world': {
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
		}
```
It defines the action to take when the user reaches the page /hello/world.

*   `require` is an array and lists the name of the required parameters. If one of thsoe parameters is not provided, an error message will be returned to the user.
*   `auth` is either false for no authentication required, or is a string indicating which authentication method is required. More on authentication methods later in the doc.
*   `description` is only for documenting your code. Optional, used for the doc.
*   `params` gives a description fo rthe parameters used. Optional, used for the doc.
*   `status` is the current status of that code. Optional, used for the doc.
*   `version` is the current version of that code. Optional, used for the doc.
*   `callback` is where your code is located. There are 4 parameters:
    *       `params` is an object lsiting the GET and POST parameters.
    *       `req` is the request object provided by ExpressJS
    *       `res` is the resource object provided by ExpressJS
    *       `callback` is the callback function you call with the page data. Ideally, it should be called with the output of the rendering engine.

### Views ###
You can save your views anywhere you want, but it is recommanded to put them under /pages/views.

Views can be HTML, XML or any format you want them too.
By default, the framework will use the `raw` (`/api/auth/raw.js`) output formatter, returning an HTTP code 200 with a `text/html` content-type header.

If your view will return JSON, JSONP or XML data, then it should be an API, not a page.


### Setting up a new page ###

To setup a new page, be lazy and do what I do: Copy-paste-edit.

**Method 1 - Create a new file**

Copy-paste one of the file from /pages/controllers and rename it anything you want (the name of the file doesn't matter for pages).

Edit the file to leave only one page descriptor, edit the page's path and then edit the page's code.

**See it in action:** <https://www.screenr.com/02XN>


**Method 2 - Update an existing file**

Open an existing controller file, then simply add a new page descriptor in it.

**See it in action:** <https://www.screenr.com/F2XN>

[Need tutorials here]

## API ##

The apis allow you to quickly create GET and POST methods in the JSON and JSONP format, to be called client-side.
New output formats can be developped.

The framework was created with the idea that pages should only display information, while all the server-side operations should be triggered by client-side API calls. For that reason, the framework allows to create really fast and flexible API methods in a way that saves time to the developpers.

All the API related files are located under `/api`

*   `/api/auth` contains the authentication methods.
*   `/api/data-providers` contains the data-providers.
*   `/api/endpoints` contains the API methods
*   `/api/output` contains the output formatters.
*   [deprecated] `/api/hooks` contains data hooks. They are rarely used, and on their way to be deprecated.
*   [deprecated] `/api/services` contains the services. Their use is similar to data-providers and will be deprecated in the next version.
*   [deprecated] `/api/validators` contains the parameter validators, which will be deprecated.


APIs are called using the format /api/`[filename]`/`[method]`/`[(optionnal) output format]`

It's important to note that unlike pages, in the cae of APIs the name of the file matters.
If you have a file named `hello.js` containing an API method named `world`, you will call the API method using `/api/hello/world`.


To start, we are simply going to focus on basic API methods, without authentication.

### Creating a new API method ###

Let's create a new api method `/api/hello/world`:

In the directory `/api/endpoints`, copy-paste any of the existing JS file, then do as for pages: Remove code you don't want, edit the code that's left.
It's the fastest way to create new APIs, and that's how I do it.

**See it in action:** <https://www.screenr.com/i2XN>

As you can see in the video, the method wrapping your API code is called with 4 arguments:

*   `params` contains the parameters passed to the API, serialized as an array; That includes both GET and POST parameters. If there is an authentication method set for the API call, then a new property `__auth` will be extending `params`, containing the user ID or any other identifier for the user's account. More on authentication later.
*   `req` is the ExpressJS `request` object.
*   `res` is the ExpressJS `resource` object.
*   `callback` is the callback function that you call to return the data. You can only call that function once, or an error will be thrown ("Header already sent [...]")

**A note on returning errors:**
Sometimes, you'll need to return errors. All errors should have the same format, to make it easy to detect and process them client-side. For that reason, in case you need to retun an error, you should use this syntax:

```
callback(Gamify.api.errorResponse("Error message"));
return false;   // Prevent the rest of the code from executing.
```

`Gamify.api.errorResponse()` takes a second optionnal argument, an error number. By default, that error number is 0.

**Return:** `{"error":{"number":0,"message":"Error message"}}`


## Authentication ##

Authentication is an important part of any web project.

You don't want users to be able to access any API call, but you don't want neither to have to write code in every single restricted API call to check if a user has the right to accesss that content.
You need a way to just specify what authentication method to use, and have it check and refuse access without any further code from you.

### Basics ###

Here I'll explain the basic principles behind any authentication.

Here is the typical flow:

The user logs in. You send his credential to an API call that checks if that user exists. If the credentials don't match a user account, you return an error message. If the credentials match a user, you need a way to have that user authenticated for upcoming API calls and page loads. The best way is to use a cookie.

You can't store the user's email and password in a cookie. It would be unsafe, as cookies are pretty easy to intercept and read. You need a way to identify the user, but using data that could be stolen without much consequences.

A method that is commonly used is to create an access token, a random string that is linked to the user's account but that expires after a pre-defined time. That token is saved into a cookie, that is then read and used to authentify a user in upcoming api call and page loads.

Here is the precise flow that is recommended:

*   The user enters his credentials, sent to the server using an API call.
*   If the credentials match a user, the API call creates a new token and returns it to the client-side. You can use the provided AuthKey data-providers: `Gamify.data.authKey.generateFor(user_id, function(authkey, expiration_date) { callback({token: authkey, expires: expiration_date}); })`
*   The code client-side receives that token and set it as a cookie named 'authkey' (for compatibility with the provided authkey authentication method)
*   When a user goes to a page or an API call that has the `authkey` authentication method, that method will look for a cookie named `authkey` and see if that token is valid and associated to a user account. If it's not valid or expired, the page or API call will be aborted and the user will be returned an error message indicating an authkey is required to access that page/api call.
*   If the token is valid, the page/API call will be executed, with a new property `__auth` being passed in the `params` object. `params.__auth` contains the user's ID, that you can then use to query your database and do anything on behalf of the user.

### Create your own authentication methods  ###

Authentication methods are located in `/api/auth`.

Just like in the case of page controllers or API controllers, when you create a new authentication method you can either create a new file, or simply extend an existing one.

As for any of the other framework files, you do not need to use `require()` anywhere, those files are found and loaded when the framework starts.

Here are 2 videos that show how to create and use a new authentication method. We are going to create an authentication method called `testAuth`, that will require a parameter `token` to be passed and have the value `helloworld` to authenticate a user with id `1`. In the real world, you'd have some database queries to check if a user exists and return its real user ID, but that would be too long for a simple example.

Part one: <https://www.screenr.com/YUXN>

Part two: <https://www.screenr.com/vUXN>

