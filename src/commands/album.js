const Command = require('../structures/Command');
const Discord = require('discord.js');
const config = require('../../src/data/config.json');
module.exports = new Command({
    name: 'album',
    description: 'show album link',
    async run(message, args, client) {
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
    }
    
})