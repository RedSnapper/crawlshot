#!/usr/bin/env node

'use strict';

const program = require('commander'),
  crawlShotter = require('../lib/crawlshot-main.js'),
  colors = require('colors');

let settings = {pageres: { options: {} },crawler: {}};

program.usage('URL'.green + ' [options]'.yellow);

program.option('-d, --debug', 'Debugging enabled',
			function() {
				console.log('  - debugging enabled'.green);
				settings.debug = true;
			}
		)
		.option('-m, --mobile', 'screenshotting at mobile size', 
			function() { 
				console.log('  - mobile mode enabled'.green); 
				settings.pageres.size = '600x480'; 
			}
		)
		.option('-D, --depth <n>','choose the depth we crawl to',
			function(n) {
				console.log(`  - depth set to ${n}`.green); 
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
		.option('-r, --directory <directories>','restrict crawl to provided directories',
			(directories)=>{
				console.log(` - restricting crawl to: ${directories}`);

				let dirArray = [];

				if(directories.indexOf(',') !== -1) {
					dirArray = directories.split(',');
				} else {
					dirArray.push(directories);
				}

				dirArray.forEach((item,index)=>{
					dirArray[index] = `/${item}/`;
				});

				settings.directories = dirArray; 
				settings.directory = true;
			}
		)
		.parse(process.argv);

if(!program.args.length) {
	console.log('No URL provided; use "crawlshot --help" for user info'.yellow);
	return;
}

if(program.args[0].length) {
	var query = program.args[0];
} else {

}

if(query) {
	crawlShotter(query,settings);
}
