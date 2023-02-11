const { deleteCookie } = require("../buildMessage")

function terminateLiveChat(){
    deleteCookie("chatLiveAgentId");
    deleteCookie("chatLiveAgentRedirect");
}

module.exports={terminateLiveChat}