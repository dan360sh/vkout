const server = require('http').createServer();
const fs = require('fs');
const http = require('https');
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});
server.listen(80, () => console.log("сервер запущен"));
server.on('request', (req, res) => {
  file.serve(req, res);
});