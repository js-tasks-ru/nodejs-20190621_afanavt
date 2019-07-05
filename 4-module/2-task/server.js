const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

function printEmit(emitter, emitterName){
    const emit = emitter.emit;
    emitter.emit = (...args) => {
        console.log(`${emitterName} emit: %s`, args[0]);
        return emit.apply(emitter, args);
    }
}

const server = new http.Server();
//printEmit(server, 'server');

server.on('error', () => {
    res.statusCode = 500;
    res.end('error');
})

server.on('request', (req, res) => {
    //printEmit(req, 'req');

    const pathname = url.parse(req.url).pathname.slice(1);

    if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('nested directories not implemented');
    }

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'POST':
            const stream = fs.createWriteStream(filepath, {flags: 'wx'});
            const limitSizeStream = new LimitSizeStream({limit: 1048576});
            //printEmit(stream, 'stream');

            limitSizeStream.on('error', (err) => {
                fs.unlink(filepath, () => {});

                if (err instanceof LimitExceededError) {
                    res.statusCode = 413;
                    res.end('big file error');
                } else {
                    res.statusCode = 500;
                    res.end('error');
                }
            })

            req.pipe(limitSizeStream).pipe(stream);

            stream.on('close', () => {
                res.statusCode = 201;
                res.end('ok');
            })

            stream.on('error', (err) => {
                if (err.code === 'EEXIST') {
                    res.statusCode = 409;
                    res.end('file already exists');
                } else {
                    res.statusCode = 500;
                    res.end('error');
                }
            });

            req.on('aborted', () => {
                fs.unlink(filepath, () => {});
            });

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
