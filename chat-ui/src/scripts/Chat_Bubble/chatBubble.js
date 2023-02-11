import { sendMessage, getDateString, messageTypes, createMessageHTML } from "../../main"
import { headers } from "../headers";

let chatBubble = `<div id="chat-bubble" class="bot-typing">
                        <div class="typing-bubble">
                            <span class="circle scaling"></span>
                            <span class="circle scaling"></span>
                            <span class="circle scaling"></span>
                        </div>
                    </div>`;

function showChatBubble() {
    let messagesList = document.getElementById("messagesList");
    messagesList.innerHTML += chatBubble;
}

function removeChatBubble() {
    // let messagesList = document.getElementById("messagesList");
    const chatBubble = document.getElementById("chat-bubble");
    if(chatBubble != null) {
        chatBubble.remove();
    }
}



export { showChatBubble,removeChatBubble };