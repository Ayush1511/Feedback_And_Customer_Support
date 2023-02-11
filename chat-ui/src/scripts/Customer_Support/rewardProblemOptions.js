import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from "../headers"
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage } from "../buildMessage";
const chatWindow = document.getElementById('messagesList');
function rewardProblemOptionsMessage(response) {


    let messagesList = document.getElementById("messagesList");
    let rewardData = "";
    response.rewardProblemIssues.map((item) => {
        //console.log(item)
        let rewardOptionRadio = `<div class="reward-issue-options-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="reward-option-btn chat-${response.type}" id="${item}" name="reward-option-items" value="${item}">
      <label for=${item}>${item}</label>
  </div>`
        rewardData += rewardOptionRadio;
    })

    if(response.type == "checkbox") {
        let rewardOptionRadio = `<div class="reward-issue-options-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="reward-option-btn chat-${response.type} reward-issue-selectAll" id="Select All" name="reward-option-items" value="Select All">
      <label for="Select All">Select All</label>
  </div>`
        rewardData += rewardOptionRadio;
    }
    messagesList.innerHTML += `<div class="reward-issue-wrap">` + rewardData + getIssueDescriptionBox()+`<button id="reward-issue-submit-btn" hidden="hidden">Submit</button></div>`

    if(response.type == "checkbox") {
        let selectAll = document.getElementsByClassName("reward-issue-selectAll")[0];
        selectAll.addEventListener("click",() => {
            let rewardOption = document.getElementsByClassName("reward-option-btn");
            for(let i=0;i<rewardOption.length;i++) {
                rewardOption[i].checked = selectAll.checked;
            }
        })
    }

    let rewardOptionBtns = document.getElementsByClassName("reward-option-btn");
    for (let i = 0; i < rewardOptionBtns.length; i++) {
        rewardOptionBtns[i].addEventListener("click", function () {
            const submitBtn = document.getElementById("reward-issue-submit-btn");
            submitBtn.removeAttribute("hidden");

        })
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    let submitBtn = document.getElementById("reward-issue-submit-btn");
    submitBtn.addEventListener("click", function () {
        let rewardOptionBtns = document.getElementsByClassName("reward-option-btn");
        let rewardOptionSelected = [];
        for (let i = 0; i < rewardOptionBtns.length; i++) {
            if (rewardOptionBtns[i].checked == true && rewardOptionBtns[i].id != "Select All") {
                rewardOptionSelected.push(rewardOptionBtns[i].id);
            }
        }
        console.log("Reward Option Selected", rewardOptionSelected)

        // const messageSend = {
        //     message: "Issues related to reward problems are selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,
        //         rewardProblemIssue: rewardOptionSelected,
        //         descriptionMessage:document.getElementById("issue_description").value,
        //     }
        // }
        const messageSend = buildMessage({"text":"Issues related to reward problems are selected","type":messageTypes.RIGHT,"data":{rewardProblemIssue: rewardOptionSelected,
            "descriptionMessage":document.getElementById("issue_description").value}});
        document.getElementsByClassName("reward-issue-wrap")[0].remove();
        sendMessage(messageSend);
    })

}

export { rewardProblemOptionsMessage };