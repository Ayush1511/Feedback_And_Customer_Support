import { sendMessage,getDateString,messageTypes } from "../main";
import { buildMessage } from "./buildMessage";
import {headers} from './headers' 
function itemList(card_item){
    let itemString = ""
    //console.log(card_item.items)
    card_item.items.map((item) => {
        //console.log(item.product.name)
        itemString += item.product.name + ","
    });
    return itemString.slice(0, -1);
}

function getDate(text) {
    if(text==undefined){
        return "N/A"
    }
    var { 0: year, 1: month, 2: day } = text.split("-");
    let daySuffix = (day >= 4 && day <= 20) || (day >= 24 && day <= 30)
        ? "th"
        : ["st", "nd", "rd"][day % 10 - 1];
    let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    let dateString = Number(day) + daySuffix + " " + monthList[month - 1] + " " + year
    return dateString
}


function showOrderCards(data){
    // Your JS code goes here
    //console.log("res",response);
    let cards = "";
    let response=data.orders;
    response.map((card_item) => {
        
        let price=card_item.orderRequestPrice;
        if(card_item.orderRequestPrice==undefined){
            price=card_item.paymentSummary.paymentSummaryItem[card_item.paymentSummary.paymentSummaryItem.length-1].value;
            //console.log("price",price);
        }
        let order = "";
        
        order+=`<div class="card-order" id=${card_item.orderId}>`
        order+=`<div class="card-order-number"><p style="font-weight: bold;">Order Number ${card_item.store.orderId}</p></div>`
        order+=`<div class="card-order-item-qty"><p style="font-weight: bold;">${card_item.items.length} Item(s)</p></div>`
        order+=`<div class="card-order-items">${itemList(card_item)}</div>`
        order+=`<div class="card-line"></div>`
        order+=`<div class="card-order-date"><p style="font-weight: bold;">Order Placed on ${getDate(card_item.store.orderDate)}</p></div>`
        order+=`<div class="card-order-time">Order placed at- ${card_item.store.orderTime}</div>`
        order+=`<div class="card-order-amt">For amount - &#x20b9; ${price}</div>`
        if(data.selectButton!==false){
        order+=`<div class="card-order-footer"><div class="card-order-select-btn"><p>Select</p></div></div>`
        }
    order+=`</div>`;
        cards += order;
    });

    let tempCards = document.getElementById("messagesList");
    tempCards.innerHTML += `<div id="order-cards"><div class="card-wrap">` + cards + `</div></div>`


    //console.log("selectBtn",data.selectButton);
    if(data.selectButton!==false){
    const cardSelectBtns = document.getElementsByClassName("card-order-select-btn");
    //console.log(cardSelectBtns)
    for (let i = 0; i < cardSelectBtns.length; i++) {
        //console.log("hi",cardSelectBtns[i])
        cardSelectBtns[i].addEventListener("click", function () {
            let id = cardSelectBtns[i].closest('.card-order').id;
            // console.log(id);
            //console.log(id)
            // const messageSend={
            //     message:"Select Order",
            //     author: '',
            //     date: getDateString(),
            //     type:messageTypes.RIGHT,
            //     metadata: {
            //         headers: headers,
                
            //         orderid:id,
            //     }
            // }
            const messageSend =buildMessage({"text":"Select Order","type":messageTypes.RIGHT,"data":{orderid:id}});
            document.getElementById("order-cards").remove();
            sendMessage(messageSend);
            
        })
    }
}


}

export {showOrderCards};