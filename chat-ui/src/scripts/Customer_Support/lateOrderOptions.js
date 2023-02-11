import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from "../headers"
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage } from "../buildMessage";
const chatWindow = document.getElementById('messagesList');
function lateOrderOptionsMessage(response) {

    let messagesList = document.getElementById("messagesList");
    let lateOrderItem = "";
    response.lateOrderIssue.map((lateOrder) => {
        console.log(lateOrder)
        let lateOrderBtn = `<div class="late-order-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="late-order-btn chat-${response.type}" id="${lateOrder.name}" name="late-order-items" value="${lateOrder.name}">
      <label for=${lateOrder.name}>${lateOrder.name}</label>
  </div>`
        lateOrderItem += lateOrderBtn;
    })

    if(response.type=="checkbox"){
        let lateOrderBtn = `<div class="late-order-btn-container chat-${response.type}"> 
  <input type="${response.type}" class="late-order-btn chat-${response.type} late-order-selectAll" id="Select All" name="late-order-items" value="Select All">
      <label for="Select All">Select All</label>
  </div>`
        lateOrderItem += lateOrderBtn;
    }
    messagesList.innerHTML += `<div class="late-order-wrap">` + lateOrderItem + getIssueDescriptionBox()+`<button id="late-order-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`

    if(response.type=="checkbox"){
        let selectAll=document.getElementsByClassName("late-order-selectAll")[0];
        selectAll.addEventListener("click",function(){
            let lateOrderOptionBtns = document.getElementsByClassName("late-order-btn");
            for (let i = 0; i < lateOrderOptionBtns.length; i++) {
                lateOrderOptionBtns[i].checked=selectAll.checked;
            }
        })
    }
    let lateOrderBtns = document.getElementsByClassName("late-order-btn");
    for (let i = 0; i < lateOrderBtns.length; i++) {
        lateOrderBtns[i].addEventListener("click", function () {
            const submitBtn = document.getElementById("late-order-submit-btn");
            submitBtn.removeAttribute("hidden");
        })
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    let submitBtn = document.getElementById("late-order-submit-btn");
    submitBtn.addEventListener("click", function () {
        let lateOrderIssue=[]
        let lateOrderBtns = document.getElementsByClassName("late-order-btn");
        for (let i = 0; i < lateOrderBtns.length; i++) {
            if (lateOrderBtns[i].checked == true && lateOrderBtns[i].id!=="Select All") {
                lateOrderIssue.push({name:lateOrderBtns[i].id});
            }
        }
        console.log("issue_description",document.getElementById("issue_description").value.length);
        // const messageSend = {
        //     message: "Late order issues are selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,
        //         lateOrderIssue:lateOrderIssue,
        //         descriptionMessage:document.getElementById("issue_description").value,
        //     }
        // }
        const messageSend = buildMessage({"text":"Late order issues are selected","type":messageTypes.RIGHT,"data":{lateOrderIssue:lateOrderIssue,
            "descriptionMessage":document.getElementById("issue_description").value}})
        document.getElementsByClassName("late-order-wrap")[0].remove();
        sendMessage(messageSend);
    })

}

export {lateOrderOptionsMessage};