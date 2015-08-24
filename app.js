var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();
var port = 3333;

app.use(serveStatic(__dirname, {'index': ['index.html']}));
app.listen(port);
console.log('> listen post:', port);