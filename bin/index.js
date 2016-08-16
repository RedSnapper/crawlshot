#!/usr/bin/env node

'use strict';

const program = require('commander'),
  crawlShotter = require('../lib/crawlshot.js');

let settings = {pageres: { options: {} },crawler: {}};

program.option('-d, --debug', 'Debugging enabled',
			function() {
				console.log('  - debugging enabled');
				settings.debug = true;
			}
		)
		.option('-m, --mobile', 'screenshotting at mobile size', 
			function() { 
				console.log('  - mobile mode enabled'); 
				settings.pageres.size = '600x480'; 
			}
		)
		.option('-D, --depth <n>','choose the depth we crawl to',
			function(n) {
				console.log('  - depth set to ' +n); 
				settings.crawler.depth = n; 
			}
		)
		.option('-u, --username <u>','enter a username',
			function(u) {
				// set pageres and crawler usernames
				settings.crawler.authUser = settings.pageres.options.username = u;
				settings.crawler.needsAuth = true;
			}
		)
		.option('-p, --password <p>','enter a password',
			function(p){
				// set pageres and crawler passwords
				settings.crawler.authPass = settings.pageres.options.password = p;
				settings.crawler.needsAuth = true;
			}
		)
		.parse(process.argv);

if(program.args[0].length) {
	var query = program.args[0];
}

if(query) {
	crawlShotter(query,settings);
}
