const server = require('http').createServer();
const fs = require('fs');
const https = require('https');
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});

let str = '';
let client_id = '6270779';
let client_secret = 'OZggJ070SyQVXMDaRRnJ';
let redirect_uri = 'http://danilshitov.ru/';
server.listen(80, () => console.log("сервер запущен"));
server.on('request', (req, res) => {
	console.log(req.url);
	if(req.method=='GET'){
		let code = req.url.split('=')[1];
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
	   	 let rawData = '';
	   	 res.on('data', (chunk) => { rawData += chunk; });
     	 res.on('end', () => {
     	 	console.log(rawData);
     	 });
	});
}