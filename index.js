const Discord = require('discord.js');
const client = new Discord.Client();

const TeemoJS = require('teemojs');
let api = TeemoJS('RGAPI-09f0406d-6ffa-4ee7-8ea0-9ae3fc1329ca');

const strings = require('./strings.json');
const Validator = require('./validate-input');

const RIOT_API_TOKEN = "MUST BE REGENERATED";
const DISCORD_API_TOKEN = "NTEwMzc2Mzc5MTYyOTUxNjgy.DsbdHw._9aZew87jeunfQl6hzvW1bPlpEs";
const unknownCmd = "***Unknown Command:***\t\'**>help**\' for command list and usage";


/*class Lobby{
    constructor(){
        this.summoners = new Array(10);
        this.gameId = -1;
    }

    getLobby(tournamentCode, summonerName){
        let url = `https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${RIOT_API_TOKEN}`;     //TODO: Implement other regions
        let text, accId;
        request.get(url)
            .then((res) => {
                text = JSON.parse(res.text);
                accId = text.accountId;
                this.getTournamentGames(accId);
            })
            .catch((e) =>{
                console.log(e.toString());
            });
    }
    getTournamentGames(tournamentCode){
        let url = `https://euw1.api.riotgames.com/lol/match/v3/matches/by-tournament-code/${tournamentCode}/ids`;
        let games;
        request.get(url)
            .then((res) => {
                games = JSON.parse(res.text);
                this.gameSearch(games);
            })
    }
    gameSearch(games){
        let url = `https://euw1.api.riotgames.com/lol/match/v3/matches/${matchId}`;

        games.forEach((g) =>{

        });

        request.get(url)
            .then((res) => {
                games = JSON.parse(res.text);
                this.gameSearch(games);
            })
    }
}*/


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

    if(recvMessage.content.startsWith('>')){
        let validInput = Validator.validate(recvMessage);
        if(validInput[0]){
            processCommand(validInput[1])
        }else{
            // Send error msg to User
            recvMessage.channel.send(validInput[1])
                .catch((e)=>{
                    console.log(`Unable to send message\t ${e}`);
                });
        }

        /*let response = processCommand(recvMessage);     // TODO: change to wait on a promise

        response.then((res) => {
            // console.log("result of summonsearch: " + res);
        }).catch((error)=> {
            console.log("error caught in processCommand Promise");
            console.log(error.toString());
        });*/
        /*recvMessage.channel.send(response)
            .catch((e)=>{
                console.log(`Unable to send message\t ${e}`);
            });*/
    }
});

/*function processCommand(recvMessage) {          // TODO: Return a promise instead of a string
    let cmd = recvMessage.content.substr(1, recvMessage.length);
    let splitCmd = cmd.split(" ");
    let primary = splitCmd[0];
    let args = splitCmd.slice(1);


    switch (primary.toLowerCase()) {
        case 's': {
            if (!validateName(args)) {
                return unknownCmd + "\n\t\t***Note:***\tIf searching for Summoner, " +
                    "make sure supplied name is __valid.__";
            }
            else {


                // TODO: Research and implement promise to return when api call finishes
                // return searchSummonerName(args);
                break;
            }
        }
        case 'ls': {
            let lobby = new Lobby();
            // lobby.getLobby("Tourny ID", "Summonername");
            return "TODO: implement search of players in lobby- tournament id from Riot API";
        }
        case 'help': {
            if (args.length > 1) {
                return unknownCmd;
            }
            return getHelp(args);
        }
        default:
            return unknownCmd;
    }
}*/
function processCommand(recvMessage) {
    /*return new Promise((resolve, reject) => {
        let cmd = recvMessage.content.substr(1, recvMessage.length);
        let splitCmd = cmd.split(" ");
        let primary = splitCmd[0];
        let args = splitCmd.slice(1);

        switch (primary.toLowerCase()) {
            case 's': {
                if (!validateName(args)) {
                    reject(unknownCmd + "\n\t\t***Note:***\tIf searching for Summoner, " +
                        "make sure supplied name is __valid.__");
                }
                else {
                    // resolve(searchSummonerName(args));
                    console.log("summonsearch from process cmd: " + searchSummonerName(args));
                    break;
                }
            }
            case 'ls': {
                let lobby = new Lobby();
                // lobby.getLobby("Tourny ID", "Summonername");
                return "TODO: implement search of players in lobby- tournament id from Riot API";
            }
            case 'help': {
                if (args.length > 1) {
                    return unknownCmd;
                }
                return getHelp(args);
            }
            default:
                return unknownCmd;
        }
    })*/
}

function searchSummonerName(args) {
    api.get(strings[args[0]], 'summoner.getBySummonerName', formSummonerName(args, 0))    // .then(() => {} );
        .then((res) => {
            console.log("searchSummonerName: ");
            console.log(res);
            console.log((res === null || res === undefined) ? false : true);
            return (res === null || res === undefined) ? false : true;
    }).catch(() => {
        console.log("Teemo unable to get summoner");
        return false;
    });


    /*console.log(res);
    console.log(res.name + "'s summoner id is " + res.id + '.');
    return formOpGGUrl(args)*/

}

function getHelp(args){
    if(args.length === 0){
        return "TODO: list of all commands correctly formatted";
    }else{
        switch(args[0]){
            case 's': return "**>s** *{Region}* [Summoner Name]\t\t- **Note:** Acceptable regions: EUW, EUNE, NA, KR, JP," +
                            " OCE, BR, LAN, LAS, RU, TR";
            case 'ls': return "**>ls** [Tournament Token] [Summoner Name]";
            default: return unknownCmd;
        }
    }
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

function validateName(args){
    let validName = /^[0-9\p{L} ]+$/;                                               // TODO: Implement a correct regex for all valid summoner names

    if(args.length < 2){
        console.log("Too few args");
        return false;
    }
    else{
        let name = "";
        args.forEach((x) => {
            name = name.concat(x);
        });
        if(name.length > 16 || name.length < 1){
            console.log("Name too long");
            return false;
        }
        else{
            //TODO: Create a correct RegEx to validate ALL possible names
            console.log("name is valid");
            return true;
        }
    }
}



client.login(DISCORD_API_TOKEN)
    .catch((e)=>{
        console.log(`Unable to login\t ${e}`);
    });