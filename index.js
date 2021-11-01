
console.clear();

const Discord = require('discord.js');

const keepAlive = require('./server.js');
const Client = require('./src/structures/Client');
const Command = require('./src/structures/Command');
const client = new Client();
const config = require('./src/data/config.json');
const moment = require('moment');
const imgur = require('imgur');
const fs = require('fs');
fs.readdirSync("./src/commands").filter(file => file.endsWith('.js')).forEach(file => {
    /**
     * @type {Command}
     */
    const command = require(`./src/commands/${file}`);
    console.log(`Command ${command.name} loaded`);
    client.commands.set(command.name, command);

})

client.on('ready', () => {
    console.log("This 'ICUDeadBot' is running now o/ ")
})

client.on('message', message => {
  
  if (message.channel.name == config.eventName ){
    if (message.author.bot) return;

    else {
        // regex for spaces
        if (!message.content.startsWith(config.prefix)) {
            if (message.content.length !== 0) {
                submitICUDead(message);
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
  }
});

function submitICUDead(message) {
    // dunno why i check this btw but just in case lol
    if (typeof message.content === 'string') {
        if (message.attachments.size > 0) {
            let url = '';
            message.attachments.forEach(function (attachment) {
                url = attachment.url;
            })
            var msg = message.content.split('\n');
            if (msg.length != 2) {
                message.reply('Wrong format');
                return;
            }
            
            let submitter = msg[0].split(':');
            let corpse = msg[1].split(':');

            // console.log(submitter)
            // console.log(corpse)
            generateData(submitter[1], corpse[1]);
            uploadImgur(submitter[1], corpse[1],url);
            const embed = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle("You can see other submissions here")
              .setURL(config.album)
              .setAuthor('Thank you for your submission!', 'https://i.imgur.com/fEIDGra.png', config.album)
              .setDescription('The link to album of all submissions in ICU dead Event')
              .setThumbnail('https://i.imgur.com/fEIDGra.png')
              .setTimestamp()
              .setFooter('The next dead could be you!', 'https://i.imgur.com/fEIDGra.png');

            message.channel.send(embed);
            // message.channel.send('Thank you for your submission!');

        } else if (message.content == 'Bad Zev') {
            message.channel.send('is always bad~');
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
        if (element.trim().toLowerCase() != submitter.trim().toLowerCase()) {

            //update records
            let row = {
                submitter: submitter.trim().toLowerCase(),
                dead: element.trim().toLowerCase(),
            };
            data.records.push(row)

            // update dead
            if (data.deads.hasOwnProperty(element.trim().toLowerCase())) {
                data.deads[element.trim().toLowerCase()] += 1;
            } else {
                data.deads[element.trim().toLowerCase()] = 1;
            }

            // update submitter
            if (data.submitters.hasOwnProperty(submitter.trim().toLowerCase())) {
                data.submitters[submitter.trim().toLowerCase()] += 1;
            } else {
                data.submitters[submitter.trim().toLowerCase()] = 1;
            }
        }
    });

    
    json = JSON.stringify(data, null, 2);
    fs.writeFile('./src/data/record.json', json, 'utf8', function (err) {
        if (err) throw err;
        console.log('complete');
    });

}

function uploadImgur(submitter,corpse,url) {
  imgur.setCredentials(config.username, config.password, config.clientId);
  var description = "Submitted by : "+submitter.trim()+"\nSaw death of :"+corpse+"\nSubmitted Date : "+moment().format('Do MMM YY, hh:mm:ss [GMT+7]');
  imgur
  .uploadUrl(url,config.albumId,undefined,description)
  .then((json) => {
    // console.log(json.link);
  })
  .catch((err) => {
    console.error(err.message);
  });
}

keepAlive();
client.login(process.env['TOKEN']);

