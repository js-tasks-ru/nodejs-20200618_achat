const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенные папки не поддерживаются');
      } else {
        fs.access(filepath, fs.constants.R_OK, err => {
          if(err){
            res.statusCode = 404;
            res.end("Файла на диске нет");
          }
          else{
            fs.createReadStream(filepath).pipe(res);
          }
        });
      }
      break;

    default:
      res.statusCode = 500;
      res.end('Not implemented');
  }
});

module.exports = server;
