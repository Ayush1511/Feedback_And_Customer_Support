import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from "../headers"
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage } from "../buildMessage";

const chatWindow = document.getElementById('messagesList');
function refundProblemOptionsMessage(response) {


    let messagesList = document.getElementById("messagesList");
    let refundData = "";
    response.refundProblemIssues.map((item) => {
        //console.log(item)
        let refundOptionRadio = `<div class="refund-options-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="refund-option-btn chat-${response.type}" id="${item}" name="refund-option-items" value="${item}">
      <label for=${item}>${item}</label>
  </div>`
        refundData += refundOptionRadio;
    })
    if(response.type=="checkbox") {
        let refundOptionRadio = `<div class="refund-options-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="refund-option-btn chat-${response.type} refund-option-selectAll" id="Select All" name="refund-option-items" value="Select All">
      <label for="Select All">Select All</label>
  </div>`
        refundData += refundOptionRadio;
    }
    messagesList.innerHTML += `<div class="refund-problem-wrap">` + refundData + getIssueDescriptionBox()+`<button id="refund-problem-submit-btn" hidden="hidden">Submit</button></div>`

    if(response.type == "checkbox") {
        let selectAll = document.getElementsByClassName("refund-option-selectAll")[0];
        selectAll.addEventListener("click",() => {
            let refundOption = document.getElementsByClassName("refund-option-btn");
            for(let i=0;i<refundOption.length;i++) {
                refundOption[i].checked = selectAll.checked;
            }
        })
    }

    let refundOptionBtns = document.getElementsByClassName("refund-option-btn");
    for (let i = 0; i < refundOptionBtns.length; i++) {
        refundOptionBtns[i].addEventListener("click", function () {
            const submitBtn = document.getElementById("refund-problem-submit-btn");
            submitBtn.removeAttribute("hidden");
        })
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    let submitBtn = document.getElementById("refund-problem-submit-btn");
    submitBtn.addEventListener("click", function () {
        let refundOptionBtns = document.getElementsByClassName("refund-option-btn");
        let refundOptionSelected=[];
        for (let i = 0; i < refundOptionBtns.length; i++) {
            if (refundOptionBtns[i].checked == true && refundOptionBtns[i].id != "Select All") {
                refundOptionSelected.push(refundOptionBtns[i].id);
            }
        }
        // const messageSend = {
        //     message: "Issue related to Refund problem selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,
        //         refundProblemIssue: refundOptionSelected,
        //         descriptionMessage:document.getElementById("issue_description").value,
        //     }
        // }
        const messageSend = buildMessage({"text":"Issue related to Refund problem selected","type":messageTypes.RIGHT,"data":{refundProblemIssue: refundOptionSelected,
            "descriptionMessage":document.getElementById("issue_description").value}});
        document.getElementsByClassName("refund-problem-wrap")[0].remove();
        sendMessage(messageSend);
    })

}

export { refundProblemOptionsMessage };