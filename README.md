# crawlshot
CLI for crawling a website and taking screenshots of each page. 

## installation

npm install rs.crawlshot -g

## usage

$ crawlshot https://yoursite.com

## Options

* -h --help 					: help
* -d --debug			 		: debugging
* -r --directory [directories]	: restricts crawlshot to only return images of the provided site paths.
  * $ crawlshot https://siteurl.co.uk -r clients,about,team
* -m --m 						: screenshot at mobile size
* -D --depth <n>				: choose the depth we crawl to
* -u --username <u> 			: enter a username
* -p --password <p> 			: enter a password


If all goes to plan crawlshot should create a folder in the location it was called and fill it with screenshots of the site.