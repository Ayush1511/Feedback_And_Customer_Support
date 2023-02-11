import { sendMessage, getDateString, messageTypes } from "../../main";
import { headers } from "../headers"
import {getIssueDescriptionBox} from '../Customer_Support/issueDescriptionBox'
import { buildMessage } from "../buildMessage";

const chatWindow = document.getElementById('messagesList');
function productQualityOptionsMessage(response) {
    //console.log(response.itemTypesOptions["PIZZA"])

    let itemsAccord = '';
    for (var types in response.itemTypesOptions) {
        //console.log(types)
        let items = response.itemTypesOptions[types].items;
        let options = response.itemTypesOptions[types].options
        for (let item in items) {
            itemsAccord += `<button class="product-quality-accordion-item-btn" value="${items[item].name}">${items[item].name}  &#43</button>`

            let checkButton = ""
            for (let option in options) {
                checkButton += `<div class="chat-${response.type}"><input type="${response.type}" id="${options[option]}" name="product-quality-inputs-${items[item].name}" value="${options[option]}" class="product-quality-option-checkbox  product-quality-option-checkbox-${items[item].name} chat-${response.type}"/>`
                checkButton += `<label>${options[option]}</label> <br></div>`
            }
            if(response.type=="checkbox"){
                //console.log("inside select all button append");
                checkButton += `<div class="chat-${response.type}"><input type="${response.type}" id="productQuality-option-selectAll-${items[item].name}" name="product-quality-inputs-${items[item].name}" value="Select All" class="product-quality-option-checkbox product-quality-option-checkbox-${items[item].name} chat-${response.type}"/>`
                checkButton += `<label>Select All</label> <br></div>`
                //console.log(checkButton)
            }
            itemsAccord += `<div class="product-quality-accordion-checkbox-buttons">` + checkButton + `</div>`
            
            //console.log(items[item].name)
            //console.log(options)
        }

    }

    

    let messagesList = document.getElementById("messagesList");
    messagesList.innerHTML += `<div class="product-quality-accordion-wrap">` + itemsAccord +getIssueDescriptionBox() +`<button id="product-quality-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`
    for (var types in response.itemTypesOptions) {
        let items = response.itemTypesOptions[types].items;
        let options = response.itemTypesOptions[types].options
        for (let item in items) {
    if(response.type=="checkbox"){
        let selectAll=document.getElementById(`productQuality-option-selectAll-${items[item].name}`);
        selectAll.addEventListener("click",function(){
            let optionButtons=document.getElementsByClassName(`product-quality-option-checkbox-${items[item].name}`);
            for(let i=0;i<optionButtons.length;i++){
                optionButtons[i].checked=selectAll.checked;
            }
        })
    }
}
}
    var acc = document.getElementsByClassName("product-quality-accordion-item-btn");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("active");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    let checkboxEvent=document.getElementsByClassName("product-quality-option-checkbox");
    for(let i=0;i<checkboxEvent.length;i++){
        checkboxEvent[i].addEventListener("click",productQualityCountCheckBox);
    }

    let submitBtn=document.getElementById("product-quality-submit-btn");
    submitBtn.addEventListener("click",productQualitySubmit);


}

function productQualityCountCheckBox() {
    const inputElems = document.getElementsByClassName("product-quality-option-checkbox");
    let count = 0;

    for (let i = 0; i < inputElems.length; i++) {
        if (inputElems[i].checked === true) {
            count++;
        }
    }
    const submitBtn = document.getElementById("product-quality-submit-btn")



    if (count > 0) {
        submitBtn.removeAttribute("hidden");
    } else {
        submitBtn.setAttribute("hidden", "hidden");
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}


function productQualitySubmit() {
    console.log("beg")
    let productQualityIssues = [];
    let products = document.getElementsByClassName("product-quality-accordion-item-btn");
    for (let i = 0; i < products.length; i++) {
        let name = products[i].value;
        let options = [];
        console.log("name", name)
        let checkboxOptions = products[i].nextElementSibling.querySelectorAll(".product-quality-option-checkbox");
        for (let j = 0; j < checkboxOptions.length; j++) {
            if (checkboxOptions[j].checked == true && checkboxOptions[j].value!=="Select All") {
                options.push(checkboxOptions[j].value)
            }
        }
        if (options.length > 0) {
            productQualityIssues.push({ name: name, options: options })
        }



    }
    console.log("final", productQualityIssues);

    // const messageSend = {
    //     message: "Items for Product Quality are selected",
    //     author: '',
    //     date: getDateString(),
    //     type: messageTypes.RIGHT,
    //     metadata: {
    //         headers: headers,
    //         productQualityItemIssues:productQualityIssues,
    //         descriptionMessage:document.getElementById("issue_description").value,
    //     }
    // }
    const messageSend = buildMessage({"text":"Items for Product Quality are selected","type":messageTypes.RIGHT,"data":{productQualityItemIssues:productQualityIssues,
        "descriptionMessage":document.getElementById("issue_description").value}})
    document.getElementsByClassName("product-quality-accordion-wrap")[0].remove();
    sendMessage(messageSend);
    
}



export { productQualityOptionsMessage}