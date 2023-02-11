import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from '../headers'
import {getIssueDescriptionBox} from "../Customer_Support/issueDescriptionBox";
import { buildMessage } from "../buildMessage";
const chatWindow = document.getElementById('messagesList');
function wrongOrderOptionsMessage(response) {

    let messagesList = document.getElementById("messagesList");
    let wrongOptionDivData = "";

    response.wrongOrderIssue.map((item) => {
        let wrongOption = ``;
        if (item.suboptions.length > 0) {
            let subOptions = ``;
            for (let itm of item.suboptions) {
                subOptions += `<div class="wrong-order-sub-option">
                                <div class="chat-${item.type}">
                                <input type="${item.type}" class="wrong-option-suboption-btn wrong-sub-option-${item.name}" name="wrong-sub-option" id="${itm.item}" value="${itm.item}">
                                <label for=${itm.item}>${itm.item}</label>
                                </div>
                            </div>`;
            }
            if(item.type=="checkbox"){
                subOptions += `<div class="wrong-order-sub-option">
                                <div class="chat-${item.type}">
                                <input type="${item.type}" class="wrong-option-suboption-btn wrong-sub-option-${item.name} wrong-sub-option-selectAll-${item.name}" name="wrong-sub-option" id="Select-All-${item.name}" value="Select-All">
                                <label for=Select-All-${item.name}>Select All</label>
                                </div>
                            </div>`;
            }
            wrongOption = `<div class="wrong-option chat-${response.type}">
                            <input type="${response.type}" class="wrong-option-btn-and-suboption wrong-option-btn" name="wrong-option-item" id="${item.name}" value="${item.name}">
                            <label for=${item.name}>${item.name}</label>
                            ` + subOptions + `</div>`;
        }
        else {
            wrongOption = `<div class="wrong-option chat-${response.type}">
                            <input type="${response.type}" class="wrong-option-btn-no-suboption wrong-option-btn" name="wrong-option-item" id="${item.name}" value="${item.name}">
                            <label for=${item.name}>${item.name}</label>
                        </div>`;
        }
        wrongOptionDivData += wrongOption;
    })
    if(response.type=="checkbox"){
        let wrongOption=``;
        wrongOption = `<div class="wrong-option chat-${response.type}">
                            <input type="${response.type}" class="wrong-option-btn-and-suboption wrong-option-selectAll" name="wrong-option-item" id="Select-All" value="Select-All">
                            <label for="Select-All">Select All</label>
                            </div>`;
                            wrongOptionDivData+=wrongOption
    }
    messagesList.innerHTML += `<div class="wrong-option-wrapper">` + wrongOptionDivData + getIssueDescriptionBox()+`<button id="wrong-opt-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`

    
    
    response.wrongOrderIssue.map((item) => {
        if (item.suboptions.length > 0) {
            if(item.type=="checkbox"){
                let selectAll=document.getElementsByClassName(`wrong-sub-option-selectAll-${item.name}`)[0];
                selectAll.addEventListener("click",function(){
                    let subOptionBtns=document.getElementsByClassName(`wrong-sub-option-${item.name}`);
                    for(let i=0;i<subOptionBtns.length;i++){
                        subOptionBtns[i].checked=selectAll.checked;
                    }
                })
                
            }
        }
    })
    
    if(response.type=="checkbox"){
        let selectAll=document.getElementsByClassName("wrong-option-selectAll")[0];
        selectAll.addEventListener("click",function(){
            let wrongOptionBtns = document.getElementsByClassName("wrong-option-btn");
            for (let i = 0; i < wrongOptionBtns.length; i++) {
                wrongOptionBtns[i].checked=selectAll.checked;
            }
        })
    }
    
    
    
    // Gets all the radio buttons from their common className
    let wrongOptionBtn = document.querySelectorAll(".wrong-option-suboption-btn,.wrong-option-btn-and-suboption,.wrong-option-btn-no-suboption");
    //console.log("wrongO",wrongOptionBtn);

    // Function that adds a eventListener to each radio button and a function that makes the submit button visible
    for (let i = 0; i < wrongOptionBtn.length; i++) {
        wrongOptionBtn[i].addEventListener("click", function () {
            let submitBtn = document.getElementById("wrong-opt-submit-btn");
            let subOptionBtns = document.getElementsByClassName("wrong-option-suboption-btn");
            let noSubOptionBtns = document.getElementsByClassName("wrong-option-btn-no-suboption");
            let count = 0;
            for (let i = 0; i < subOptionBtns.length; i++) {
                let radioBtnParent = subOptionBtns[i].closest('.wrong-option').children[0];
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
            console.log("count is", count);
            if (count > 0) {
                submitBtn.removeAttribute("hidden");
            } else {
                submitBtn.setAttribute("hidden", "hidden");
            }
            chatWindow.scrollTop = chatWindow.scrollHeight;
        })
    }

    // Grabs the submit button
    let submitBtn = document.getElementById("wrong-opt-submit-btn");

    // adding eventListener to submit button
    submitBtn.addEventListener("click", function () {
        let wrongOrderIssue = []
        let wrongOptionBtnAndSuboption = document.getElementsByClassName("wrong-option-btn-and-suboption");
        let wrongOptionBtnNoSuboption = document.getElementsByClassName("wrong-option-btn-no-suboption");
        for (let i = 0; i < wrongOptionBtnAndSuboption.length; i++) {
            let name = "";
            let options = [];
            if (wrongOptionBtnAndSuboption[i].checked == true) {
                name = wrongOptionBtnAndSuboption[i].id;
                let subOptionsBtns = wrongOptionBtnAndSuboption[i].closest('.wrong-option').querySelectorAll('.wrong-option-suboption-btn');
                for (let i = 0; i < subOptionsBtns.length; i++) {
                    if (subOptionsBtns[i].checked == true && subOptionsBtns[i].value!=="Select-All") {
                        console.log("subopt", subOptionsBtns[i].id);
                        options.push({ item: subOptionsBtns[i].id });
                    }
                }
                wrongOrderIssue.push({ name: name, suboptions: options })
            }
        }


        for (let i = 0; i < wrongOptionBtnNoSuboption.length; i++) {
            let name = "";
            let options = [];
            if (wrongOptionBtnNoSuboption[i].checked == true && wrongOptionBtnNoSuboption[i].value!=="Select-All") {
                name = wrongOptionBtnNoSuboption[i].id;
                wrongOrderIssue.push({ name: name, suboptions: options });
            }

        }

        console.log("wrongOrderIssue", wrongOrderIssue);
        //   removes the whole div from html

        // const messageSend = {
        //     message: "Issues related to wrong order are selected",
        //     author: '',
        //     date: getDateString(),
        //     type: messageTypes.RIGHT,
        //     metadata: {
        //         headers: headers,

        //         wrongOrderIssue: wrongOrderIssue,
        //         descriptionMessage:document.getElementById("issue_description").value,
        //     }
        // }

        const messageSend=buildMessage({"text":"Issues related to wrong order are selected","type":messageTypes.RIGHT,"data":{wrongOrderIssue: wrongOrderIssue,
            "descriptionMessage":document.getElementById("issue_description").value}})
        document.getElementsByClassName("wrong-option-wrapper")[0].remove();
        sendMessage(messageSend);
    })


}

export { wrongOrderOptionsMessage };