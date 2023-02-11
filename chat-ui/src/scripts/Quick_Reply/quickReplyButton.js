import { sendMessage, getDateString, messageTypes, createMessageHTML } from "../../main"
import { buildMessage } from "../buildMessage";
import { headers } from "../headers";

function showQuickReplyButton(response) {
    let qucikReplyTab = document.getElementById("quickReplyTab");
    let messageList=document.getElementById("messagesList");
    let quickReplyDivData = "";
    let color="blue";
    response.buttons.map((item) => {
        let quickReply = `<div class="quick-reply-btn-container">
                                <button class="quick-reply-btn quick-reply-btn-${color}" id="${item.title}" name="button" type="button">${item.title}</button>
                            </div>`;
        quickReplyDivData += quickReply;
        color=color=="blue"?"red":"blue";
    })

    qucikReplyTab.innerHTML = `<div class="quick-reply-wrapper">` + quickReplyDivData + `</div>`
    document.getElementById("messageInput").setAttribute('placeholder','Type here or select option from above');
    let mainContent=document.getElementById("mainContent");
    let quickReplyHeight=qucikReplyTab.getBoundingClientRect().height;
    let appContainer=document.getElementById("appContainer");
    let chat=document.getElementById("chat");
    let chatInput=document.getElementsByClassName("chat-input")[0];
    let chatboxHeader=document.getElementsByClassName("chat-box-header")[0];
    // if(mainContent.getBoundingClientRect().height>appContainer.getBoundingClientRect().height-quickReplyHeight-chatInput.getBoundingClientRect().height-chatboxHeader.getBoundingClientRect().height){
    // // mainContent.style.height=(appContainer.getBoundingClientRect().height-quickReplyHeight-chatInput.getBoundingClientRect().height-chatboxHeader.getBoundingClientRect().height-30)+'px';
    // // chat.style.height=mainContent.style.height;
    // // messageList.style.height=mainContent.style.height; 
    // console.log("mainContentHeight",mainContent.style.maxHeight);
    // }
    // Gets all the buttons from their common className
    let quickReplyBtn = document.getElementsByClassName("quick-reply-btn");

    // Function that adds a eventListener to each radio button and a function that makes the submit button visible
    for (let i = 0; i < quickReplyBtn.length; i++) {
        quickReplyBtn[i].addEventListener("click", function () {
            const id = quickReplyBtn[i].id;
            console.log({ "Quick Reply Button": id });

            if (id === "Share Location") {
                getLocation();
            }
            else {
                // const messageSend = {
                //     message: id,
                //     author: '',
                //     date: getDateString(),
                //     type: messageTypes.RIGHT,
                //     metadata: {
                //         headers: headers,
                //     }
                // }
                const messageSend = buildMessage({"text":id,"type":messageTypes.RIGHT,"data":{}});
                document.getElementsByClassName("quick-reply-wrapper")[0].remove();
                document.getElementById("messageInput").setAttribute('placeholder','type here...');
                mainContent.style.maxHeight='calc(650px - 80px - 100px-170px)';
                chat.style.height=mainContent.style.height;
                messageList.style.height=mainContent.style.height; 
                sendMessage(messageSend);
            }
        })
    }
}

function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition,error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function error(err) {
    const message = {
        message: "Location not available",
        author: '',
        date: getDateString(),
        type: messageTypes.RIGHT,
        metadata: {
            headers: headers,
        }
    }
    createMessageHTML(message)
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

function showPosition(position) {
    let messageList=document.getElementById("messagesList");
    // let mainContent=document.getElementById("mainContent");
    // let chat=document.getElementById("chat");
    const location = {
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude
    };
    console.log("LOCATION",location);
    // const message = {
    //     message: "Share Location",
    //     author: '',
    //     date: getDateString(),
    //     type: messageTypes.RIGHT,
    //     metadata: {
    //         headers: headers,
    //         coordinates: {
    //             latitude: location.latitude,
    //             longitude: location.longitude
    //         }
    //     }
    // }
    const messageSend = buildMessage({"text":"Share Location","type":messageTypes.RIGHT,"data":{coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
    }}})
    document.getElementsByClassName("quick-reply-wrapper")[0].remove();
    document.getElementById("messageInput").setAttribute('placeholder','type here...');
    mainContent.style.maxHeight='calc(650px - 80px - 100px-170px)';
    chat.style.height=mainContent.style.height;
    messageList.style.height=mainContent.style.height; 
    console.log("mainContentListHeight",mainContent.style.maxHeight);
    sendMessage(messageSend);
}

export { showQuickReplyButton };