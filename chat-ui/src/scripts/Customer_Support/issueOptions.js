import { sendMessage,getDateString,messageTypes } from "../../main";
import { buildMessage } from "../buildMessage";
import {headers} from "../headers"

function issueOptions(response) {

    let issues = ""
    response.issueOptions.map((issue) => {
        let issueBtn = `
    <div class="issue-btn chat-option-btn">${issue}</div>`
        issues += issueBtn
    })
    let messageList = document.getElementById('messagesList');
    messageList.innerHTML += `<div class="issue-btn-wrap ">` + issues + `</div>`

    const issueBtns = document.getElementsByClassName("issue-btn");
    for (let i = 0; i < issueBtns.length; i++) {
        issueBtns[i].addEventListener("click", function () {
            let issue = issueBtns[i].textContent;
            const messageSend = buildMessage({"text":issue,"type":messageTypes.RIGHT,"data":{}});
            issueBtns[i].closest(".issue-btn-wrap").remove();
            sendMessage(messageSend);
        })
    }
}

export {issueOptions};