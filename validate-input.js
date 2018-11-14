module.exports = {
    validate : function (recvMessage) {
        let cmd = recvMessage.content.substr(1, recvMessage.length);
        let splitCmd = cmd.split(" ");
        let primary = splitCmd[0];
        let args = splitCmd.slice(1);

        console.log(splitCmd);
    }
}