//import modules
var express = require( 'express' );
var request = require( 'request' );
var cheerio = require( 'cheerio' );

var urls = [];
var websiteUrl = 'https://gocardless.com';
if(websiteUrl[websiteUrl.length-1] == '/'){
	console.log("lol");
}
//creating a new express server
var app = express();

//setting EJS as the templating engine
app.set( 'view engine', 'ejs' );

//setting the 'assets' directory as our static assets dir (css, js, img, etc...)
app.use( '/assets', express.static( 'assets' ) );


//makes the server respond to the '/' route and serving the 'home.ejs' template in the 'views' directory
app.get( '/', function ( req, res ) {
    res.render( 'home', {
        message: 'Home Page'
    });
});

//launch the server on the 8000 port
app.listen( 8000, function () {
    console.log( 'App listening on port 8000. Open localhost/8000 on your browser' );
});

request(websiteUrl, function(err, resp, body){
	if(!err && resp.statusCode == 200) {
		var $ = cheerio.load(body);

		//Getting all the links 'a' from the webpage
		$('a').each(function(){

			//Getting the href attribute from the 'a' link
			var url = $(this).attr('href');

			//We keep the link only if it is the same root (in order to avoid the 'undefined' links and the subdomains or outside links (like social media links))
			if(url != undefined && url[0] == '/') {
				url = websiteUrl + url;
				urls.push(url);
			}
			
		});
		console.log(urls);
	}
});