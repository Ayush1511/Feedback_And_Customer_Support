import { sendMessage, getDateString, messageTypes } from "../../main";
import { buildMessage } from "../buildMessage";
import { headers } from '../headers'

function getCategoryOptions(response) {

    let messagesList = document.getElementById('messagesList');
    let categories = "";
    //console.log(response.categories);
    for (let category in response.categories) {
        let categoryBtnDiv = "";
        categoryBtnDiv += `<div class='menu-flow-category'>`;
        categoryBtnDiv += `<div class='menu-flow-category-btn chat-option-btn'>${category}</div>`
        categoryBtnDiv += `</div>`
        categories += categoryBtnDiv;
    }
    messagesList.innerHTML += `<div id="menu-flow-categories-wrap">${categories}</div>`

    const categoryBtns = document.getElementsByClassName("menu-flow-category-btn");
    for (let i = 0; i < categoryBtns.length; i++) {
        categoryBtns[i].addEventListener("click", function () {
            const btnText = categoryBtns[i].textContent;

            // const messageSend = {
            //     message: btnText,
            //     author: '',
            //     date: getDateString(),
            //     type: messageTypes.RIGHT,
            //     metadata: {
            //         headers: headers,
            //     }
            // }
            const messageSend = buildMessage({"text":btnText,"type":messageTypes.RIGHT,"data":{}});
            document.getElementById("menu-flow-categories-wrap").remove();
            sendMessage(messageSend);
        })
    }
}

export { getCategoryOptions };