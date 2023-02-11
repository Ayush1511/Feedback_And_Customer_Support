import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from "../headers"
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage } from "../buildMessage";
const chatWindow = document.getElementById('messagesList');
function orderCancelledMessage(response) {
  

let messagesList = document.getElementById("messagesList");
let cancelOptionDivData = "";

response.orderCancelledIssue.map((item) => {
    let cancelOption = ``;
    if (item.suboptions.length > 0) {
        let subOptions = ``;
        for (let itm of item.suboptions) {
            subOptions += `<div class="cancel-order-sub-option chat-${item.type}">
                            <input type="${item.type}" class="cancel-option-suboption-btn cancel-sub-option-${item.name}" name="cancel-sub-option" id="${itm}" value="${itm}">
                            <label for=${itm}>${itm}</label>
                        </div>`;
        }
        if(item.type=="checkbox"){
            subOptions += `<div class="cancel-order-sub-option chat-${item.type}">
                            <input type="${item.type}" class="cancel-option-suboption-btn cancel-sub-option-${item.name} cancel-sub-option-selectAll-${item.name}" name="cancel-sub-option" id="Select-All${item.name}" value="Select-All">
                            <label for="Select-All-${item.name}">Select All</label>
                        </div>`;
        }
        cancelOption = `<div class="cancel-option chat-${response.type}">
                        <input type="${response.type}" class="cancel-option-btn-and-suboption cancel-option-btn" name="cancel-option-item" id="${item.name}" value="${item.name}">
                        <label for=${item.name}>${item.name}</label>
                        ` + subOptions + `</div>`;
    }
    else {
        cancelOption = `<div class="cancel-option chat-${response.type}">
                        <input type="${response.type}" class="cancel-option-btn-no-suboption cancel-option-btn" name="cancel-option-item" id="${item.name}" value="${item.name}">
                        <label for=${item.name}>${item.name}</label>
                    </div>`;
    }
    cancelOptionDivData += cancelOption;
})
if(response.type=="checkbox"){
    let cancelOption = ``;
    cancelOption = `<div class="cancel-option chat-${response.type}">
        <input type="${response.type}" class="cancel-option-btn-no-suboption cancel-option-selectAll" name="cancel-sub-option" id="Select-All" value="Select-All">
        <label for="Select-All">Select All</label>
                    </div>`;
    cancelOptionDivData += cancelOption;                
}

messagesList.innerHTML += `<div class="cancel-option-wrapper">` + cancelOptionDivData + getIssueDescriptionBox()+`<button id="cancel-opt-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`


response.orderCancelledIssue.map((item) => {
    if (item.suboptions.length > 0) {
        if(item.type=="checkbox"){
            
            let selectAll=document.getElementsByClassName(`cancel-sub-option-selectAll-${item.name}`)[0];
            selectAll.addEventListener("click",function(){
                let subOptionBtns=document.getElementsByClassName(`cancel-sub-option-${item.name}`);
                for(let i=0;i<subOptionBtns.length;i++){
                    subOptionBtns[i].checked=selectAll.checked;
                }
            })
            
        }
    }
})

if(response.type=="checkbox"){
    let selectAll=document.getElementsByClassName("cancel-option-selectAll")[0];
    selectAll.addEventListener("click",function(){
        let cancelOptionBtns = document.getElementsByClassName("cancel-option-btn");
        for (let i = 0; i < cancelOptionBtns.length; i++) {
            cancelOptionBtns[i].checked=selectAll.checked;
        }
    })
}


// Gets all the radio buttons from their common className
let cancelOptionBtn = document.querySelectorAll(".cancel-option-suboption-btn,.cancel-option-btn-and-suboption,.cancel-option-btn-no-suboption");
//console.log("wrongO",wrongOptionBtn);

// Function that adds a eventListener to each radio button and a function that makes the submit button visible
for (let i = 0; i < cancelOptionBtn.length; i++) {
    cancelOptionBtn[i].addEventListener("click", function () {
        let submitBtn = document.getElementById("cancel-opt-submit-btn");
        let subOptionBtns = document.getElementsByClassName("cancel-option-suboption-btn");
        let noSubOptionBtns = document.getElementsByClassName("cancel-option-btn-no-suboption");
        let count = 0;
        for (let i = 0; i < subOptionBtns.length; i++) {
            let radioBtnParent = subOptionBtns[i].closest('.cancel-option').children[0];
            //console.log("sibling",radioBtnParent);
            if (subOptionBtns[i].checked == true && radioBtnParent.checked == true) {
                count++;
            }
        }
        for (let i = 0; i < noSubOptionBtns.length; i++) {
            if (noSubOptionBtns[i].checked == true) {
                count++;
            }
        }
        //console.log("count is", count);
        if (count > 0) {
            submitBtn.removeAttribute("hidden");
        } else {
            submitBtn.setAttribute("hidden", "hidden");
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    })
}

// Grabs the submit button
let submitBtn = document.getElementById("cancel-opt-submit-btn");

// adding eventListener to submit button
submitBtn.addEventListener("click", function () {
    let cancelOrderIssue = []
    let cancelOptionBtnAndSuboption = document.getElementsByClassName("cancel-option-btn-and-suboption");
    let cancelOptionBtnNoSuboption = document.getElementsByClassName("cancel-option-btn-no-suboption");
    for (let i = 0; i < cancelOptionBtnAndSuboption.length; i++) {
        let name = "";
        let options = [];
        if (cancelOptionBtnAndSuboption[i].checked == true) {
            name = cancelOptionBtnAndSuboption[i].id;
            let subOptionsBtns = cancelOptionBtnAndSuboption[i].closest('.cancel-option').querySelectorAll('.cancel-option-suboption-btn');
            for (let i = 0; i < subOptionsBtns.length; i++) {
                if (subOptionsBtns[i].checked == true && subOptionsBtns[i].id!=="Select-All") {
                    //console.log("subopt", subOptionsBtns[i].id);
                    options.push(subOptionsBtns[i].id );
                }
            }
            cancelOrderIssue.push({ name: name, suboptions: options })
        }
    }


    for (let i = 0; i < cancelOptionBtnNoSuboption.length; i++) {
        let name = "";
        let options = [];
        if (cancelOptionBtnNoSuboption[i].checked == true  && cancelOptionBtnNoSuboption[i].value!=="Select-All") {
            name = cancelOptionBtnNoSuboption[i].id;
            cancelOrderIssue.push({ name: name, suboptions: options });
        }

    }

    //console.log("cancelOrderIssue", cancelOrderIssue);
    //   removes the whole div from html

    // const messageSend = {
    //     message: "Issues related to order cancelled are selected",
    //     author: '',
    //     date: getDateString(),
    //     type: messageTypes.RIGHT,
    //     metadata: {
    //         headers: headers,
    
    //         orderCancelledIssue: cancelOrderIssue,
    //         descriptionMessage:document.getElementById("issue_description").value,
    //     }
    // }
    const messageSend=buildMessage({"text":"Issues related to order cancelled are selected","type":messageTypes.RIGHT,"data":{orderCancelledIssue: cancelOrderIssue,
        "descriptionMessage":document.getElementById("issue_description").value}}); 
    document.getElementsByClassName("cancel-option-wrapper")[0].remove();
    sendMessage(messageSend);
})


}

export {orderCancelledMessage};