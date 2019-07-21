const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
    const msgs = await Message.find({text: 'message'}).limit(20);
    const messages = msgs.map(msg => ({
            id: msg.id,
            text: msg.text,
            user: msg.user,
            date: msg.date
        })
    );

    ctx.body = { messages };
};
