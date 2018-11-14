const Discord = require('discord.js');
const client = new Discord.Client();

const TeemoJS = require('teemojs');
let api = TeemoJS('RGAPI-b9a24ecc-f7ad-45d4-8520-72b289fbe3e0');

const strings = require('./strings.json');
const Validator = require('./validate-input');

const RIOT_API_TOKEN = "MUST BE REGENERATED";
const DISCORD_API_TOKEN = "NTEwMzc2Mzc5MTYyOTUxNjgy.DsbdHw._9aZew87jeunfQl6hzvW1bPlpEs";
const unknownCmd = "***Unknown Command:***\t\'**>help**\' for command list and usage";
let messageFromChannel = null;

client.on('ready', () => {
    client.user.setActivity("I spy on your behalf!")
        .catch((e)=>{
            console.log(`Unable to setActivity\t ${e}`);
        });

    console.log('Servers: ');
    client.guilds.forEach((guild) => {
        console.log("- " + guild.name);

        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        })
    });
    console.log("------------------------------------------");
});

client.on('message', (recvMessage) => {
    if(recvMessage.author == client.user){
        return;     // ignore messages from bot
    }
    messageFromChannel = recvMessage;

    if(recvMessage.content.startsWith('>')){
        let validInput = Validator.validate(recvMessage);
        if(validInput[0]){
            processCommand(validInput[1])
        }else{
            botSay(validInput[1]);      // Send error msg to User
        }
    }
});

function botSay(msg) {
    messageFromChannel.channel.send(msg)
        .catch((e)=>{
            console.log(`Unable to send message\t ${e}`);
        });
}

function processCommand(cmdParts) {          // TODO: Return a promise instead of a string
    let primary = cmdParts[0];
    let args = cmdParts.slice(1);


    switch (primary.toLowerCase()) {
        case 's': {
            // console.log(formOpGGUrl(args));
            searchSummonerName(args);
        }
        case 'ls': {

        }
        case 'help': {

        }
        default:
    }
}

function searchSummonerName(args) {
    api.get(strings.regions[args[0]], 'summoner.getBySummonerName', formSummonerName(args, 0))
        .then((res) => {
            console.log("searchSummonerName: ");
            console.log(res);
            botSay(formOpGGUrl(args))
    }).catch((e) => {
        console.log("Teemo unable to get summoner");
        console.log(e.toString());
    });
}

/**
 * Forms the Summoner name passed in 1 of 2 possible ways.
 * mode = 0: User name formed with spaces, as user would read in game i.e ['hide','on','bush'] = 'hide on bush'
 * mode = 1: Formed for use in url using '+' i.e hide+on+bush
 * @param args
 * @param mode
 * @returns {string}
 */
function formSummonerName(args, mode){
    let name = "", ctr = 1;

    let appendage = mode === 0 ? " " : "+";
    while(ctr < args.length) {
        name = name.concat(args[ctr]);
        if(ctr < args.length - 1)  name = name + appendage;
        ctr++;
    }
    return name;
}

function formOpGGUrl(args) {
    let name = formSummonerName(args,1);
    if(args[0].toLowerCase() === 'kr'){
        return `http://www.op.gg/summoner/userName=${name}`;
    }else                                                                           // TODO: Check if supplied region is valid (object structure)
        return `http://${args[0].toLowerCase()}.op.gg/summoner/userName=${name}`;
}


client.login(DISCORD_API_TOKEN)
    .catch((e)=>{
        console.log(`Unable to login\t ${e}`);
    });