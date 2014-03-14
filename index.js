var st = require('st'),
    http = require('http');

var mount = st({
  path: 'public/',
  url: '/',
  index: 'index.html'
});

http.createServer(mount).listen(process.env.PORT || 8000);
