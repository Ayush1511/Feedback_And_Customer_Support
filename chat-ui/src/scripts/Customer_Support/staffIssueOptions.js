import { sendMessage, getDateString, messageTypes } from "../../main";
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage} from "../buildMessage";
const chatWindow = document.getElementById('messagesList');
function staffIssueOptionsMessage(response) {


    let messagesList = document.getElementById("messagesList");
    let staffData = "";
    response.staffBehaviourIssues.map((item) => {
        //console.log(item)
        let staffBehaviourCheckBox = `<div class="staff-issue-options-btn-container"> 
  <div class="chat-${response.type}"><input type="${response.type}" class="staff-option-btn chat-${response.type}" id="${item}" name="staff-option-items" value="${item}">
      <label for=${item}>${item}</label></div>
  </div>`
        staffData += staffBehaviourCheckBox;
    })

    if(response.type == "checkbox") {
        let staffBehaviourCheckBox = `<div class="staff-issue-options-btn-container"> 
  <div class="chat-${response.type}"><input type="${response.type}" class="staff-option-btn chat-${response.type} staff-issue-selectAll" id="Select All" name="staff-option-items" value="Select All">
      <label for="Select All">Select All</label></div>
  </div>`
        staffData += staffBehaviourCheckBox;
    }
    messagesList.innerHTML += `<div class="staff-issue-wrap">` + staffData + getIssueDescriptionBox()+`<button id="staff-issue-submit-btn" hidden="hidden">Submit</button></div>`

    if(response.type == "checkbox") {
        let selectAll = document.getElementsByClassName("staff-issue-selectAll")[0];
        selectAll.addEventListener("click",() => {
            let staffIssue = document.getElementsByClassName("staff-option-btn");
            for(let i=0;i<staffIssue.length;i++) {
                staffIssue[i].checked = selectAll.checked;
            }
        })
    }

    let staffOptionBtns = document.getElementsByClassName("staff-option-btn");
    for (let i = 0; i < staffOptionBtns.length; i++) {
        staffOptionBtns[i].addEventListener("click", function () {
            const submitBtn = document.getElementById("staff-issue-submit-btn");
            let count = 0;
            for (let j = 0; j < staffOptionBtns.length; j++) {
                if (staffOptionBtns[j].checked == true) {
                    count++;
                }
            }
            if (count > 0) {
                submitBtn.removeAttribute("hidden");
            } else {
                submitBtn.setAttribute("hidden", "hidden");
            }
            chatWindow.scrollTop = chatWindow.scrollHeight;
        })
    }
    let submitBtn = document.getElementById("staff-issue-submit-btn");
    submitBtn.addEventListener("click", function () {
        let staffOptionBtns = document.getElementsByClassName("staff-option-btn");
        let staffOptionSelected = [];
        for (let i = 0; i < staffOptionBtns.length; i++) {
            if (staffOptionBtns[i].checked == true && staffOptionBtns[i].id != "Select All") {
                staffOptionSelected.push(staffOptionBtns[i].id);
            }
        }
        console.log("staff Option Selected", staffOptionSelected)

        // const messageSend = {
        //     message: "Issues related to staff behaviour are selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,
        //         staffBehaviourIssue: staffOptionSelected,
        //         descriptionMessage:document.getElementById("issue_description").value,
        //     }
        // }
        const messageSend=buildMessage({"text":"Issues related to staff behaviour are selected","type:":messageTypes.RIGHT,"data":{staffBehaviourIssue: staffOptionSelected,
            "descriptionMessage":document.getElementById("issue_description").value}});
        document.getElementsByClassName("staff-issue-wrap")[0].remove();
        sendMessage(messageSend);
    })

}


export { staffIssueOptionsMessage };