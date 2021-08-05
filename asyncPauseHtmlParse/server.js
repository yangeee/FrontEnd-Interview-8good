const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if(req.url === '/test1.js') {
    fs.readFile('test1.js', 'utf8' , (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('');
        return;
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/css')
      res.end(data);
      return;
    })
  }

});

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
});
