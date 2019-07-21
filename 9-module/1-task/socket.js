const socketIO = require('socket.io');
const mongoose = require('mongoose');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
    const io = socketIO(server);

    io.use(async function(socket, next) {
        const { token  } = socket.handshake.query;
        if(!token){
            return next(new Error("anonymous sessions are not allowed"));
        }
        const session = await Session.findOne({ token  }).populate('user');
        if(!session){
            return next(new Error('wrong or expired session token'));
        }

        socket.user = session.user;
        next();
    });

    io.on('connection', function(socket) {
        socket.on('message', async (msg) => {
            const date = new Date();
            socket.emit('user_message', {
                user: socket.user.displayName,
                text: msg,
                date,

            });

            await Message.create({
                user: socket.user.displayName,
                text: msg,
                date,
                chat: socket.user
            });
        });
    });

    return io;
}

module.exports = socket;
