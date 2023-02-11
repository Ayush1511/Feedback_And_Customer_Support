import { sendMessage, getDateString, messageTypes } from "../../main";
import { buildMessage } from "../buildMessage";
import { getIssueDescriptionBox } from "./issueDescriptionBox";
import { headers } from "../headers"
const chatWindow = document.getElementById('messagesList');
function feedbackOptionsMessage(response) {


    let messagesList = document.getElementById("messagesList");
    let feedbackData = "";
    response.feedbackOptions.map((item) => {
        //console.log(item)
        let feedbackOptionBtn = `<div class="feedback-options-btn-container"> 
  <div class="chat-${response.type}"><input type="${response.type}" class="feedback-option-btn chat-${response.type}" id="${item}" name="feedback-option-items" value="${item}">
      <label for=${item}>${item}</label></div>
  </div>`
        feedbackData += feedbackOptionBtn;
    })
    if(response.type=="checkbox"){
        let feedbackOptionBtn = `<div class="feedback-options-btn-container"> 
  <div class="chat-${response.type}"><input type="${response.type}" class="feedback-option-btn chat-${response.type} feedback-option-selectAll" id="Select All" name="feedback-option-items" value="Select All" ">
      <label for="Select All">Select All</label></div>
  </div>`
        feedbackData += feedbackOptionBtn;
    }
    messagesList.innerHTML += `<div class="feedback-issue-wrap">` + feedbackData +getIssueDescriptionBox()+ `<button id="feedback-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`

    if(response.type=="checkbox"){
        let selectAll=document.getElementsByClassName("feedback-option-selectAll")[0];
        selectAll.addEventListener("click",function(){
            let feedbackOptionBtns = document.getElementsByClassName("feedback-option-btn");
            for (let i = 0; i < feedbackOptionBtns.length; i++) {
                feedbackOptionBtns[i].checked=selectAll.checked;
            }
        })
    }


    let feedbackOptionBtns = document.getElementsByClassName("feedback-option-btn");
    for (let i = 0; i < feedbackOptionBtns.length; i++) {
        feedbackOptionBtns[i].addEventListener("click", function () {
            const submitBtn = document.getElementById("feedback-submit-btn");
            let count = 0;
            for (let j = 0; j < feedbackOptionBtns.length; j++) {
                if (feedbackOptionBtns[j].checked == true) {
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
    let submitBtn = document.getElementById("feedback-submit-btn");
    submitBtn.addEventListener("click", function () {
        let feedbackOptionBtns = document.getElementsByClassName("feedback-option-btn");
        let feedbackOptionSelected = [];
        for (let i = 0; i < feedbackOptionBtns.length; i++) {
            if (feedbackOptionBtns[i].checked == true) {
                feedbackOptionSelected.push(feedbackOptionBtns[i].id);
            }
        }
        console.log("feedback Option Selected", { feedbackOptions: feedbackOptionSelected })

        // const messageSend = {
        //     message: "Feedback Options are selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,
        //         feedbackOptions: feedbackOptionSelected,
        //     }
        // }
        const messageSend = buildMessage({"text":"Feedback Options are selected","type":messageTypes.RIGHT,"data":{feedbackOptions: feedbackOptionSelected,"descriptionMessage":document.getElementById("issue_description").value}});
        document.getElementsByClassName("feedback-issue-wrap")[0].remove();
        sendMessage(messageSend);
    })
    

}




export { feedbackOptionsMessage };