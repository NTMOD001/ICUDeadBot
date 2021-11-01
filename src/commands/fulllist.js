const Command = require('../structures/Command');
const fs = require('fs');
const config = require('../../src/data/config.json');
module.exports = new Command({
    name: 'fulllist',
    description: 'show all list',
    async run(message, args, client) {

        if (config.adminId.includes(message.author.id)){
          let rawdata = fs.readFileSync('./src/data/record.json');
          let data = JSON.parse(rawdata);
          let submitters = data.submitters;
          let deads = data.deads;
          var sortableSubmitters = [];
          for (var user in submitters) {
              sortableSubmitters.push([user, submitters[user]]);
          }

          sortableSubmitters.sort(function (a, b) {
              return b[1] - a[1];
          });
          const msgSubmitters = generateMessage(sortableSubmitters, 'Submitter');

          message.author.send(msgSubmitters);

          var sortableDeads = [];
          for (var user in deads) {
              sortableDeads.push([user, deads[user]]);
          }

          sortableDeads.sort(function (a, b) {
              return b[1] - a[1];
          });
          const msgDeads = generateMessage(sortableDeads, 'Dead');

          message.author.send(msgDeads);
        }
    }
})

function generateMessage(arr, topic) {
    var contentMessage = '';
    let leaderboard = arr;
    leaderboard.forEach(element => {
      let name = element[0].split(' ')       
      contentMessage += capitalizeCase(name).padEnd(20, ' ');  
      contentMessage += ' : ' + element[1].toString().padStart(3, ' ') + '\n'
      // contentMessage += `  ${element[0]} : ${element[1]} \n`
    });
    const header = '__**' + topic + ' Leaderboard**__';

    const message = header + '\n' + '```' + contentMessage + '```'
    return message;
}


function capitalizeCase(name) {
    let first = name[0];
    let last = name[1];
    let firstname = first.toLowerCase();
    let capFirstName = firstname.charAt(0).toUpperCase() + firstname.substring(1, firstname.length);
    let lastname = last.toLowerCase();
    let capLastName = lastname.charAt(0).toUpperCase() + lastname.substring(1, lastname.length);
    return capFirstName + " " +capLastName;
}