import { getSessionCookie, getHeaders, getCookie } from "../buildMessage";
import { setCookieWithValue } from "../buildMessage";
function connectWithLiveAgent(response,socketLiveChat){
    let chatSessionId = getSessionCookie()
    setCookieWithValue("chatLiveAgentId",response.data.id,1/48)
    setCookieWithValue("chatLiveAgentRedirect",true,1/48)
    let messageObj={
        content:"Connect to user with userId "+getHeaders().userid,
        sendTo:getCookie("chatLiveAgentId"),
        userChatSessionId:chatSessionId,
        from: chatSessionId
    }
    if(getCookie('chatFirstName') || getCookie('chatLastName')){
        messageObj.userInfo={};
        if(getCookie('chatFirstName')){
            messageObj.userInfo.firstName = getCookie('chatFirstName');
        }
        if(getCookie('chatLastName')){
            messageObj.userInfo.lastName = getCookie('chatLastName');
        }
    }
    console.log("Emitting connect_user_and_live_agent event to live agent socket: " + messageObj)
    socketLiveChat.emit("connect_user_and_live_agent",messageObj)
}

export {connectWithLiveAgent};