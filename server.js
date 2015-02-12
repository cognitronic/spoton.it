/**
 * Created by Danny Schreiber on 2/11/2015.
 */
var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var cheerio = require('cheerio');
var port = 3000;


app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	next();
});
app.use(express.static(path.join(__dirname), '/src/common/assets'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'code fighter fur life',
	resave: false,
	saveUninitialized: true
}));

app.use(cors({origin: 'http://localhost:3000'}));
app.use(logger('dev'));



//app.options('*', cors());

var http = require('http'),
	httpProxy = require('http-proxy');
//
// Create a basic proxy server in one line of code...
//
// This listens on port 8000 for incoming HTTP requests
// and proxies them to port 9000
httpProxy.createServer(9000, 'localhost').listen(8000, function(){
	console.log('proxy listening on port 8000');
});

//
// ...and a simple http server to show us our request back.
//
http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
	res.write(req.url);
	res.end();
}).listen(9000);






app.get('*', function(req, res){
	res.sendfile('./index.html');
});

app.listen(port);
console.log("App listening on port " + port);