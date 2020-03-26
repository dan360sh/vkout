const server = require('http').createServer();
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');
var mime = require('mime');
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});

var str = '';
var client_id = '6270779';
var client_secret = 'OZggJ070SyQVXMDaRRnJ';
var redirect_uri = 'http://danilshitov.ru/';
server.listen(80, () => console.log("сервер запущен"));
server.on('request', async function(req, res){
	var index = fs.readFileSync('index.html');
	 if(req.headers['cache-control']){
	  	res.writeHead(200,{'Content-Type':"text/html; charset=utf-8"});
	  	res.end(index);
	  	//console.log(req.headers);	
	  	return;	
	  }
	  if(req.headers['upgrade-insecure-requests']){
	  	res.end(index);
	  	return;
	  }
	 console.log(req.headers);
	if(req.url.indexOf("?")!=-1){
		var code = req.url.split('=')[1];
		str = 'https://oauth.vk.com/access_token?client_id='+client_id+'&client_secret='+client_secret+'&redirect_uri='+redirect_uri+'&code='+code;		
		console.log(str);
		var user = await get();
		console.log(user);
		var user2 = await get2(user);
		console.log(user2);
		var h1 = user2.response.first_name + ' ' + user2.response.last_name;
		const $ = cheerio.load(index);
		$('.h1').text(h1);
		index = $.html();
	}
	res.writeHead(200,{'Content-Type':"text/html; charset=utf-8"});
   //res.writeHead(200,{'Set-Cookie':'mycookie=test','Content-Type':"text/html; charset=utf-8"});
   //console.log(req.headers.cookie);
   //var index = fs.readFileSync('index.html');
   //mime.lookup(req.url);
   //res.writeHead(200,{'Content-Type':"text/html; charset=utf-8"});
   res.end(index);
   //console.log(req.headers.cookie.split('; '));
  //file.serve(req, res);
});
async function get (){
	return new Promise((resolve,reject)=>{
		https.get(str, (res)=>{
			 const { statusCode } = res;
		     const contentType = res.headers['content-type'];
		   	 res.setEncoding('utf-8');
		   	 var rawData = '';
		   	 res.on('data', (chunk) => { rawData += chunk; });
	     	 res.on('end', () => {
	     	 	console.log(rawData);
	     	 	rawData = JSON.parse(rawData);
	     	 	if(rawData["access_token"]){
	     	 		let user = 'https://api.vk.com/method/users.get?user_ids='+rawData["user_id"]+'&fields=bdate&access_token='+rawData["access_token"]+'&v=5.103';
	     	 		resolve(user);

	     	 	}
	     	 });
		});
	});
}
function get2 (user){
	return new Promise((resolve,reject)=>{
	https.get(user, (res)=>{
		 const { statusCode } = res;
	     const contentType = res.headers['content-type'];
	   	 res.setEncoding('utf-8');
	   	 var rawData = '';
	   	 res.on('data', (chunk) => { rawData += chunk; });
	   	 res.on('end', () => {
	   	 	rawData = JSON.parse(rawData);
	   	 	resolve(rawData);
	   	 	//get3('https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://example.com/callback&scope=friends&response_type=token&v=5.103&state=123456');

	   	 });
	});
	});
}
function get3 (user){
	https.get(user, (res)=>{
		 const { statusCode } = res;
	     const contentType = res.headers['content-type'];
	   	 res.setEncoding('utf-8');
	   	 var rawData = '';
	   	 res.on('data', (chunk) => { rawData += chunk; });
	   	 res.on('end', () => {
	   	 	
	   	 });
	});
}
