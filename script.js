const server = require('http').createServer();
const fs = require('fs');
const https = require('https');
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});

var str = '';
var client_id = '6270779';
var client_secret = 'OZggJ070SyQVXMDaRRnJ';
var redirect_uri = 'http://danilshitov.ru/';
server.listen(80, () => console.log("сервер запущен"));
server.on('request', (req, res) => {
	console.log(req.url);
	if(req.method=='GET'){
		var code = req.url.split('=')[1];
		str = 'https://oauth.vk.com/access_token?client_id='+client_id+'&client_secret='+client_secret+'&redirect_uri='+redirect_uri+'&code='+code;
		console.log(str);
		get();
	}
	
  file.serve(req, res);
});
function get (){
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
     	 		get2(user);
     	 	}
     	 });
	});
}
function get2 (user){
	https.get(user, (res)=>{
		 const { statusCode } = res;
	     const contentType = res.headers['content-type'];
	   	 res.setEncoding('utf-8');
	   	 var rawData = '';
	   	 res.on('data', (chunk) => { rawData += chunk; });
	   	 res.on('end', () => {
	   	 	console.log(rawData);
	   	 });
	});
}