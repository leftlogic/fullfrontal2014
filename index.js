var fs = require('fs'),
    http = require('http');

var index = fs.readFileSync('index.html', 'utf8');

http.createServer(function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(index);
}).listen(process.env.PORT);
