const Command = require('../structures/Command');
// just an example command lol
module.exports = new Command({
    name: "ping",
    description: "Show the ping of the bot!",
    async run(message, args, client) {
        const msg = await message.reply(`Ping: ${client.ws.ping} ms.`);
        msg.edit(`Ping: ${client.ws.ping} ms.\nMessage Ping: ${msg.createdTimestamp - message.createdTimestamp} ms.`)
    }
});