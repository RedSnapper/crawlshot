'use strict';

const path = require('path'),
  urlParser = require('url'),
  Crawler = require('simplecrawler'),
  Pageres = require('pageres'),
  extend = require('extend'),
  redirectedUrls = new Set(),
  fs = require('fs');

const defaults = {
	debug: false,
	pageres: {
		sizes: ['1280x720'],
		options: {
			crop: false
		}
	},
	crawler: {
		maxDepth: 0,
		downloadUnsupported: false,
		allowInitialDomainChange: true,
		parseHTMLComments: false
	}
}

const crawlShot = function(query,settings) {	
	const url = urlParser.parse(query);
	const crawler = new Crawler(url.hostname, url.path, url.port);
	const options = extend(true,{},defaults,settings);
	const dir = url.host.replace('.','_');
	crawlerSettings(crawler,options.crawler,url);

	if(options.debug) {
		var originalEmit = crawler.emit;
		crawler.emit = function(evtName, queueItem) {
			crawler.queue.complete(function(err, completeCount) {
				if (err) {
					throw err;
				}

				crawler.queue.getLength(function(err, length) {
					if (err) {
						throw err;
					}

					console.log("fetched %d of %d — %d open requests, %d open listeners".green,
						completeCount,
						length,
						crawler._openRequests,
						crawler._openListeners);
				});
			});

			console.log(evtName, queueItem ? queueItem.url ? queueItem.url : queueItem : null);
			originalEmit.apply(crawler, arguments);
		};
	}

	if (url.protocol) {
	  // Node's url parser includes a : at the end of protocol, simplecrawler expects no :.
	  crawler.initialProtocol = url.protocol.slice(0, -1);
	}

	crawler.on('fetchcomplete', (queueItem) => {
		const pageMimeType = /^(text|application)\/x?html/i;

		if (redirectedUrls.has(queueItem.url)) {
			console.log('Crawler skipping redirected URL %s', queueItem.url);
		} else if (query === queueItem.url) {
			console.log('Crawler skipping initial URL %s', queueItem.url);
		} else if (pageMimeType.test(queueItem.stateData.contentType)) {
			console.log('Crawler found URL %s', queueItem.url);

			// parse url & create title var
			let pageres = new Pageres();
			let parsed = urlParser.parse(queueItem.url);
			var title = parsed.path === '/' ? 'index' : parsed.path.substr(1);
			title = dir+'/'+title.replace('/','_') + '.png';

			pageres.src(queueItem.url,options.pageres.sizes,options.pageres.options);
			pageres.dest(dir);
			pageres.run();

		} else {
			console.log('Crawler found non html URL %s', queueItem.url);
		}
	});

	const resolve = ()=> console.log("Finished");
	crawler.on('complete', resolve);
	fs.exists(dir,(exists) => {
		if(!exists){
			fs.mkdir(dir,(err)=>{
				if(err){
					console.log(err)
				}
				crawler.start();
			});
		} else {
			crawler.start();
		}
	})
}

function crawlerSettings(crawler,settings,url) {
	extend(true,crawler,settings);

	crawler.addFetchCondition(function(parsedURL) {
	  const extension = path.extname(parsedURL.path);
	  return ['.html','.php',''].indexOf(extension) !== -1;
	});

	crawler.on('fetchredirect', (queueItem, parsedURL, response) => {
	  redirectedUrls.add(response.headers.location);
	  console.log(response.headers.location);
	});
}

module.exports = crawlShot;