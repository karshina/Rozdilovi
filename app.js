var express = require('express')
var app = express()
var base64 = require('base64-stream')
var crypto = require('crypto')
var fs = require('fs') 

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname + "/public" })
})

app.post('/upload', function(req, res, err) {
  var filename = 'uploads/' + crypto.randomBytes(10).toString('hex') + '.png'
  var filepath = __dirname + '/' + filename
  console.log('Saving card to: ', filepath)

  var file = fs.createWriteStream(filepath)
  req.pipe(base64.decode()).pipe(file)

  file.on("error", function(err) {
    console.error(err.stack || err)
    next(err)
  })
  file.on("finish", function() {
    res.json({
      filename: filename
    })
  })
})

app.use(express.static('public'))

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})
