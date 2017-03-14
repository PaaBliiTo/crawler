# Web Crawler

> Node.js basic web crawler


## Installation

1. Download / clone the project and extract the folder from the .zip
2. If you don't already have it : [INSTALL NODE](https://nodejs.org/en/)
3. Open command prompt in the directory (if you are on windows : Shift + Right Click -> 'Open command window here')
4. Type in the console `npm install`

You now have all the files needed !

## How to use

The program includes a really basic user interface. Once the node is launched, you won't have to type anything into the command prompt to have a result. Everything else has to be done in your browser.

Steps:

1. Run `node crawler.js` in the command prompt to launch the node. If everything works, you should see the message 'App listening on port 8000. Open localhost:8000 in your browser'. __WARNING__ : Never close the command prompt window !! (or the node will be stopped)

2. Open your browser and go to the adress [localhost:8000](localhost:8000)

3. Here, enter the website URL you want to crawl in the textbox (make sure there is no mistake in the URL, as there is almost no error handling). ___Good URL format example :___ `https://www.google.com` (don't forget the https:// or the request might fail)

4. Hit the 'Crawl !' button

5. Nothing happens on the browser. That's normal. Now take a look at your command prompt window. The JSON object with every reachable page and every static asset should appear !

## Important things

- For unknown reasons, some scripts assets are not considered by the crawler, so they might not appear in the output.
- As requested, the crawler does not cross subdomains and doesn't pick external links (social media links present on the page for example)
- Crawler made for [GoCardless](https://www.gocardless.com)