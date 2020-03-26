const server = require('http').createServer();
const fs = require('fs');
const https = require('https');
const sqlite3 = require('sqlite3').verbose();
const cheerio = require('cheerio');
var mime = require('mime');
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});
function cookie_parse(cookie){
	let m = {};
	let c = cookie.split('; ');
	for(var i in c){
		m[c[i].split('=')[0]] = c[i].split('=')[1];
	}
	return m;
}
function parsedom(file,data){
	var h1 = data.first_name + ' ' + data.last_name;
	const $ = cheerio.load(file);
	$('.h1').text(h1);
	$('.a1').remove();
	$('.block').html("<button class='btn2'>выйти</button>");
	//mass_header['Set-Cookie'] = 'login=dan12';
	return $.html();
}
async function sqlite(sql){
	var base_open = [];
  return new Promise((resolve,reject)=>{
    let db = new sqlite3.Database('magic.db', (err) => {
  			if (err) {
  	            resolve(err);  	            
  	        }
  	});
  	db.all(sql, [], (err, rows) => {
  	  if (err) {
  	    resolve(err);
  	   
  	  }else{
  		  try{
  			  rows.forEach((row) => {
  			    base_open.push(row);  
  			  });
  			  resolve(base_open);
  		  }catch(e){
  		  	  resolve(rows);
  		  }
  	  }

  	});
 });
    db.close();      
}
async function mainsql(){
    var str = await sqlite(`CREATE TABLE user(
     id TEXT NOT NULL,
 	 password TEXT NOT NULL,
     data TEXT NOT NULL)`);
    console.log(str)
}
async function user_in(id,password,data){
	var str = await sqlite( `INSERT INTO user(id,password,data) 
	VALUES('`+id+`','`+password+`','`+data+`')`);
	return str;
}
async function user_select(login1){
	console.log(login1);
	var str = await sqlite( `SELECT*FROM user WHERE id = '`+login1+`'`);
	return str;
}
async function main(){
	 let data = {
      id: 140104825,
      first_name: 'Данил',
      last_name: 'Шитов',
      is_closed: false,
      can_access_closed: true,
      bdate: '29.5.1997'
     }
	//await user_in('danil3','123',JSON.stringify(data));
	var s = await user_select('danil3');
	console.log(JSON.parse(s[0].data).id);
}
 
 //main();

//mainsql();


var str = '';
var client_id = '6270779';
var client_secret = 'OZggJ070SyQVXMDaRRnJ';
var redirect_uri = 'http://danilshitov.ru/';
server.listen(80, () => console.log("сервер запущен"));
server.on('request', async function(req, res){
	let head = 'text/html';
	let mass_header = {};
	let file = '';
	if(req.url=='/'){
		head = 'text/html';
		file = 'index.html';
	}else{
		file = req.url.slice(1);
		head = mime.getType(req.url);
	}
	mass_header['Content-Type'] = head+"; charset=utf-8";
	try{
		var index = fs.readFileSync(file);
	}catch(e){
		var index = fs.readFileSync('index.html');
	}

	let cookie = cookie_parse(req.headers.cookie);
	if(cookie['login']){
		let l = await user_select(cookie['login']);
		if(l.errno==undefined){
			console.log('index2');
			if(cookie['password']){
				console.log('index1');
				if(l[0].password==cookie['password']){
					let p = JSON.parse(l[0].data);
					index = parsedom(index,JSON.parse(l[0].data));
					mass_header['Set-Cookie'] = 'login='+p.id+'; password='+p.id+5;
					console.log('index');
				}
			}
		}
	 }
	 console.log(req.headers.cookie)
	 if(req.headers['cache-control']){
	  	res.writeHead(200,mass_header);
	  	res.end(index);
	  	return;	
	  }
	  if(!req.headers['upgrade-insecure-requests']){
	  	res.end(index);
	  	return;
	  }

	 console.log(req.url);

		if(req.url.indexOf("?")!=-1){
			var code = req.url.split('=')[1];
			str = 'https://oauth.vk.com/access_token?client_id='+client_id+'&client_secret='+client_secret+'&redirect_uri='+redirect_uri+'&code='+code;		
			console.log(str);
			var user = await get();
			console.log(user);
			var user2 = await get2(user);
			console.log(user2);
			var h1 = user2.response[0].first_name + ' ' + user2.response[0].last_name;
			const $ = cheerio.load(index);
			$('.h1').text(h1);
			$('.a1').remove();
			$('.block').html("<button class='btn2'>выйти</button>");
			mass_header['Set-Cookie'] = 'login='+user2.response[0].id+'; password='+user2.response[0]+5;
			index = $.html();
			console.log(index);
		}
	console.log(head);
	res.writeHead(200,mass_header);
    res.end(index);

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
