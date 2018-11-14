const strings = require('./strings');

module.exports = {
    validate : function (recvMessage) {
        let cmd = recvMessage.content.substr(1, recvMessage.length);
        let splitCmd = cmd.split(" ");
        let primary = splitCmd[0];
        let args = splitCmd.slice(1);


        //  TODO: Bot displays appropriate error message
        switch(primary.toLowerCase()){
            case 's': {
                if(args.length < 2) {
                    console.log("Too few args supplied");
                    return [false, strings.errMessage["invalidUseS"]];
                }
                if(!(args[0].toLowerCase() in strings.regions)){
                    console.log("not a valid region identifier");
                    return false;
                }
                let name = formSummonerName(args.slice(0));
                if(name.length > 16){
                    console.log("Invalid Summoner Name: Too long");
                    return false;
                }
                /*if(!name matches Regex){
                    console.log("Invalid Summoner Name: Does not match regex");
                    // botSay(errMesg)
                    return false;
                }*/
                return [true, splitCmd];
            }
            // -----------------------------------------------------------------------------
            case 'ls': {
                console.log("TODO: Implement ls command");
                return [false, "ls not yet implemented"];
            }
            // -----------------------------------------------------------------------------
            case 'help' :{
                console.log(args.length);
                if(args.length > 1){
                    console.log("Too many args supplied");
                    return [false,strings.errMessage.invalidUseHELP];
                }
                if(args.length === 1 && !(args[0].toLowerCase() in strings.commands)){
                    console.log("Unknown command: invalid arg to '>help [cmd]'");
                    return [false,strings.errMessage.invalidUseHELP];
                }
                return [true, splitCmd];
            }
            // -----------------------------------------------------------------------------
            default:{
                console.log("Unknown cmd");
                return [false, strings.errMessage.unknownCmd];
            }
        }
    }
}

function formSummonerName(args) {
    let name = "", ctr = 1;
    while(ctr < args.length) {
        name = name.concat(args[ctr]);
        if(ctr < args.length - 1)  name = name + " ";
        ctr++;
    }
    return name;
}