const Command = require('../structures/Command');
const fs = require('fs');
module.exports = new Command({
    name: 'fulllist',
    description: 'show all list',
    async run(message, args, client) {
        let rawdata = fs.readFileSync('./src/data/record.json');
        let data = JSON.parse(rawdata);
        message.author.send(JSON.stringify(data,null,2));
        // message.channel.send(JSON.stringify(data,null,2));
    }
})