const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs-extra");

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенные папки не поддерживаются');
      } else if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end("Файла на диске нет");
      } else {
        fs.unlinkSync(filepath);
        res.statusCode = 200;
        res.end("Файл удалён");
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
