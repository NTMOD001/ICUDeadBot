const Command = require('../structures/Command')
const fs = require('fs');
module.exports = new Command({
    name: 'leaderboard',
    description: 'Show Top 3 Submitter and Top 3 Dead',
    async run(message, args, client) {
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

        message.channel.send(msgSubmitters);

        var sortableDeads = [];
        for (var user in deads) {
            sortableDeads.push([user, deads[user]]);
        }

        sortableDeads.sort(function (a, b) {
            return b[1] - a[1];
        });
        const msgDeads = generateMessage(sortableDeads, 'Dead');

        message.channel.send(msgDeads);
    }

})

function generateMessage(arr, topic) {
    var contentMessage = '';
    let leaderboard = arr.slice(0, 3);
    leaderboard.forEach(element => {
        contentMessage += element[0].padEnd(20, ' ');
        contentMessage += ' : ' + element[1].toString().padStart(3, ' ') + '\n'
        // contentMessage += `  ${element[0]} : ${element[1]} \n`
    });
    const header = '__**' + topic + ' Leaderboard TOP3**__';

    const message = header + '\n' + '```' + contentMessage + '```'
    return message;
}