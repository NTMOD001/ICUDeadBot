
console.clear();

const Discord = require('discord.js');

const Client = require('./structures/Client');
const Command = require('./structures/Command');
const client = new Client();
const config = require('./data/config.json');
const moment = require('moment');

// client.commands = new Discord.Collection();

const fs = require('fs');
fs.readdirSync("./src/commands").filter(file => file.endsWith('.js')).forEach(file => {
    /**
     * @type {Command}
     */
    const command = require(`./commands/${file}`);
    console.log(`Command ${command.name} loaded`);
    client.commands.set(command.name, command);

})

client.on('ready', () => {
    console.log("This 'Basic Bot' is running now o/ ")
})

client.on('messageCreate', message => {
    console.log(message.author);
    if (message.author.bot) return;

    else {
        // regex for spaces
        if (!message.content.startsWith(config.prefix)) {
            if (message.content.length !== 0) {
                validateICUMessage(message);
                return;
            } else {
                return;
            }

        }

        const args = message.content.substring(config.prefix.length).split(/ +/);
        const command = client.commands.find(cmd => cmd.name == args[0]);

        if (!command) return message.reply("Bruhh, Invalid command!");

        command.run(message, args, client);

    }

});

function validateICUMessage(message) {
    // dunno why i check this btw but just in case lol
    if (typeof message.content === 'string') {
        if (message.attachments.size > 0) {
            var msg = message.content.split('\n');
            if (msg.length != 2) {
                message.reply('Wrong format');
                return;
            }
            console.log('message: ', msg);
            let submitter = msg[0].split(':');
            let corpse = msg[1].split(':');

            // console.log(submitter)
            // console.log(corpse)
            generateData(submitter[1], corpse[1]);
            message.reply('Thank you for your submission!');

        } else if (message.content == 'Bad Zev') {
            message.reply('is always bad~');
            return;
        }
    }
}
function generateData(submitter, corpse) {
    let rawdata = fs.readFileSync('./src/data/record.json');
    let data = JSON.parse(rawdata);
    // console.log('data', data);

    let corpses = corpse.split(',');

    corpses.forEach(element => {
        if (element.trim() != submitter.trim()) {

            //update records
            let row = {
                submitter: submitter.trim(),
                dead: element.trim(),
                time: moment(),
            };
            data.records.push(row)

            // update dead
            if (data.deads.hasOwnProperty(element.trim())) {
                data.deads[element.trim()] += 1;
            } else {
                data.deads[element.trim()] = 1;
            }

            // update submitter
            if (data.submitters.hasOwnProperty(submitter.trim())) {
                data.submitters[submitter.trim()] += 1;
            } else {
                data.submitters[submitter.trim()] = 1;
            }
        }
    });

    // console.log(data);
    json = JSON.stringify(data, null, 2);
    fs.writeFile('./src/data/record.json', json, 'utf8', function (err) {
        if (err) throw err;
        console.log('complete');
    });

}

// client.on('error', (e) => console.error(e));
// client.on('warning', (e) => console.warn(e));
// client.on('debug', (e) => console.info(e));
client.login(config.token);
