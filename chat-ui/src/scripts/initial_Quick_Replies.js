import { sendMessage, messageTypes } from "../main";
import {buildMessage} from "../scripts/buildMessage";
function initialQuickReplies(){
	const appContainer = document.getElementById("appContainer");
  const appContainerInitial = document.getElementById("appContainer-initial");
  const quickReplies = {
    "quick_replies": [
        {
            "content_type": "text",
            "title": "Order History",
            "payload": ""
        },
        {
            "content_type": "text",
            "title": "Raise a issue",
            "payload": ""
        },
        {
            "content_type": "text",
            "title": "View offers and deals",
            "payload": ""
        },
        {
            "content_type": "text",
            "title": "Stores near me",
            "payload": ""
        },
        {
            "content_type": "text",
            "title": "Show menu",
            "payload": ""
        }
    ]
	}
  let initialQuickReplyMenu = document.getElementById("initialQuickReplyMenu");
  
  

  
  
  let initialQuickReplyOptions="";
  let initialQuickReplyMenuHeader = `
  <div class="initialQuickReplyMenuHeader">
    <div class="initialQuickReplyMenuHeaderTitle">
  	  Select a conversation
    </div>
  </div>
  `
  let color="Red";
  quickReplies.quick_replies.map((reply)=>{
  	let initialQuickReply = `
    <div class="initialQuickReplyOptionContainer">
    	<div class="initialQuickReplyOptionColor${color}"></div>
      <div class="initialQuickReplyOptionMessage">${reply.title}</div>
      <div class="initialQuickReplyOptionArrow">&#9654;</div>
    </div>
    `
    color= color=="Blue"?"Red":"Blue";
    console.log(reply)
    initialQuickReplyOptions+=initialQuickReply;
  })
  /* initialQuickReplyMenu.innerHTML=userInputInitialQuickReplyContainer+orLineContainer+initialQuickReplyMenuHeader+initialQuickReplyOptions; */
  
  initialQuickReplyMenu.innerHTML=initialQuickReplyMenuHeader+initialQuickReplyOptions;
  let initialQuickReplyOptionContainer = document.getElementsByClassName("initialQuickReplyOptionContainer");
  for(let i=0;i<initialQuickReplyOptionContainer.length;i++){
    initialQuickReplyOptionContainer[i].addEventListener("click",()=>{
      const messageSend = buildMessage({"text":initialQuickReplyOptionContainer[i].querySelector(".initialQuickReplyOptionMessage").innerHTML,"type":messageTypes.RIGHT,"data":{}});
      sendMessage(messageSend);
      appContainerInitial.style.display="none";
      appContainer.style.display="block";
    })
  } 
  
}

export {initialQuickReplies};