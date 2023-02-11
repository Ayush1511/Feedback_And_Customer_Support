import { messageTypes, sendMessage } from "../../../main";
import {buildMessage} from "../../buildMessage";

function getIssueListUCR(response){


let issues = ""
    response.ucr_categories.map((group) => {
    group.categories.map((issue)=>{
    	let issueBtn = `
    <div class="issue-btn chat-option-btn" id="chatIssueId-${issue.id}">${issue.displayText}</div>`
        issues += issueBtn
    })
    })
    let messageList = document.getElementById('messagesList');
    messageList.innerHTML += `<div class="issue-btn-wrap ">` + issues + `</div>`


let issueBtns = document.getElementsByClassName("issue-btn");
for(let i=0;i<issueBtns.length;i++){
	issueBtns[i].addEventListener("click",()=>{
		let issueIdSelected = issueBtns[i].id.substring(issueBtns[i].id.indexOf('-') + 1);
    console.log("issueIdSelected",issueIdSelected);
    const messageSend = buildMessage({"text":issueBtns[i].innerHTML,"type":messageTypes.RIGHT,"data":{issueIdSelected:issueIdSelected}});
    issueBtns[i].closest(".issue-btn-wrap").remove();
    sendMessage(messageSend);
    
    
  })
}



}

export {getIssueListUCR};