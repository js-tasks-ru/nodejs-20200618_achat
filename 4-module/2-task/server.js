const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream.js");
const LimitExceededError = require("./LimitExceededError.js");

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  let outStream;

  req.on('aborted', () => {
    if (outStream) outStream.destroy();
    fs.unlinkSync(filepath);
  });

  const limitSizeStream = new LimitSizeStream({limit: 1000000});
  limitSizeStream.on('error', (err) => {
    if (err instanceof LimitExceededError) {
      if (outStream) outStream.destroy();
      fs.unlinkSync(filepath);
      res.statusCode = 413;
      res.write("Максимальный размер загружаемого файла не должен превышать 1МБ");
      setTimeout(()=>res.end(), 1000);
    }
  });

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Вложенные папки не поддерживаются');
      } else if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end("Файл уже есть на диске");
      } else {
        outStream = fs.createWriteStream(filepath);
        outStream.on('finish', () => {
          res.statusCode = 201;
          res.end();
        });

        req.pipe(limitSizeStream).pipe(outStream);
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
