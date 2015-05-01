var express = require('express'),
    server = express(),
    httpProxy = require('http-proxy'),
    proxy,
    config;

config = {
  api_url: 'http://127.0.0.1:3000',
  port: 9000
};

proxy = httpProxy.createProxyServer({});

server.use(express.static(__dirname + '/public'));
server.set('port', config.port);
server.use(function(req, res) {
  proxy.web(req, res, { target: config.api_url });
});

server.listen(config.port);

console.log("Server listening on port %d", config.port);
