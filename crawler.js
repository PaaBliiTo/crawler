//import required modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );


//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//makes the server respond to the '/' route and serving the 'index.ejs' file in the 'views' directory
app.get( '/', function ( req, res ) {
	res.render( 'index', {
 		error: "",
     });
});


//'main' function : get the value of the url entered by the user and then call the other functions
app.get( '/process', function ( req, res ) {

	//while getting the url, if the user left the last slash of the url, remove it with regex
	const rootURL = req.query.webURL.replace(/\/$/, "");
	if (rootURL) {

		//call the function getWebSites if the user well entered a url
		getWebSites(rootURL, insertUrls);
	}
});



//launch the server on the 8000 port
app.listen( 8000, function () {
    console.log( 'App listening on port 8000. Open localhost:8000 in your browser' );
});


//initialize the JSON array we will output
var websitesJSON = [];

/*
This var is a little bit special : as I am using a lot of callbacks in my code, due to the asynchronous nature of JS,
we can't know exactly when the websitesJSON array will be fully completed. To solve this problem, I created a counter
I will increment the number of times I use callbacks, and decrement it when the callback is launched.
Finally, when the callbackCount goes back to 0, all the callbacks functions are supposed to be called, and the program
will output the JSON array (see the function insertAssets for more details)
*/
var callbackCount = 0;


//get all the links from the root webpage
function getWebSites(rootURL, callback){

	var urlsArray = []; //array where we will stock the links on the page

	//Request function to get the whole html page
	request(rootURL, function(err, resp, html){
		if(!err && resp.statusCode == 200) {

			//Use the cheerio module to load the html and then use JQuery functions
			var $ = cheerio.load(html);

			//Getting all the links 'a' from the webpage
			$('a').each(function(){

				//Getting the href attribute from the 'a' link
				var url = $(this).attr('href');

				//We keep the link only if it is the same root (in order to avoid the 'undefined' links and the subdomains or outside links (like social media links))
				if(url != undefined && url[0] == '/') {

					//We add the domain name to the url we got in order to have the full link
					url = rootURL + url;

					urlsArray.push(url); //push to the array
				}
				
			});
		}

		//Call the function insertUrls
		callback(urlsArray, getAssets, rootURL);
	});
}

//Insert urls into the websitesJSON array
function insertUrls(urlsArray, callback, rootURL){

	callbackCount = urlsArray.length;

	//Create a new row in the JSON array for every link we got in the previous function
	for(var i = 0; i<urlsArray.length; i++){
		websitesJSON.push({});
		websitesJSON[i].url = urlsArray[i];
	}

	//Get the assets and then add them to the JSON array
	for(var i = 0; i < urlsArray.length; i++){
		callback(websitesJSON[i].url, insertAssets, i, rootURL);
	}

	
}


//Get the assets from a specific link
function getAssets(webUrl, callback, iteration, rootURL) {

	var assetsArray = []; //array where we will stock the links of the assets

	request(webUrl, function(err, resp, html) {
		if(!err && resp.statusCode == 200) {
			var $ = cheerio.load(html);

			//Getting all the scripts from the webpage
			$('script').each(function(){

				//Getting the src attribute
				var url = $(this).attr('src');

				//Checks if the url exists
				if(url != undefined) {

					//Checks if the url has an internal link (to add the root URL to it if so)
					if(url[0] == '/' && url[1] != '/'){
						url = rootURL + url;
						assetsArray.push(url);
					}
					else {
						assetsArray.push(url);
					}
				}
			});


			//Getting all the images from the webpage
			$('img').each(function(){

				//Getting the src attribute
				var url = $(this).attr('src');

				//Checks if the url exists
				if(url != undefined) {

					//Checks if the url has an internal link (to add the root URL to it if so)
					if(url[0] == '/' && url[1] != '/'){
						url = rootURL + url;
						assetsArray.push(url);
					}
					else {
						assetsArray.push(url);
					}
				}
			});

			//Getting all the css from the webpage
			$('link[rel="stylesheet"]').each(function(){

				//Getting the href attribute
				var url = $(this).attr('href');

				//Checks if the url exists
				if(url != undefined) {

					//Checks if the url has an internal link (to add the root URL to it if so)
					if(url[0] == '/' && url[1] != '/'){
						url = rootURL + url;
						assetsArray.push(url);
					}
					else {
						assetsArray.push(url);
					}
				}
			});

		}

		//Call the function insertAssets
		callback(assetsArray, iteration);
	});
}

//Insert the assets in the JSON array
function insertAssets(assetsArray, iteration) {

	//Set the 'assets' property in the JSON 
	websitesJSON[iteration].assets = assetsArray;

	//Decrement the callback counter because the callback has finished
	callbackCount--;

	//When evey callback is finished (i.e. callbackCount=0), STDOUT the JSON array
	if(callbackCount === 0) {
		console.log(websitesJSON);
	}
}