var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var zlib = require('zlib')

var base = path.resolve('') + '\\';

http.createServer(function (request, response) {
    var requestUrl = url.parse(request.url)
    response.writeHead(200, { 'content-encoding': 'gzip' })
    if (fs.existsSync(base + requestUrl.pathname)) {
        fs.createReadStream(base + requestUrl.pathname)
            .pipe(zlib.createGzip())
            .pipe(response)
    } else {
        response.writeHead(404);
        response.end();
    }
}).listen(8000);