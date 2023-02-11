import { sendMessage, getDateString, messageTypes } from "../../main"
import { headers } from "../headers";
import locationImage from "../../assets/images/location_final.png"
function showStoreLocationCards(response) {

    // Your JS code goes here
    //console.log("res",response);
    let cards = "";
    response.storeList.map((card_item) => {
        console.log(card_item);

        let store = `
    
    <div class="card-store-location" style="background-image:url('${locationImage}')" id=${card_item.data.id}>
    <div class="card-store-number">Store Id:- <p> ${card_item.data.id}</p></div>

    <div class="card-store-location-address">Store Address:- <p style="font-weight: bold;"> ${card_item.data.address}</p></div>
    <div class="card-store-location-phone">Phone No:- <p style="font-weight: bold;"><a href="tel:${card_item.data.phone}"> ${card_item.data.phone}</a></p></div>
    <div class="card-store-location-explore-btn"><a href="https://dev-csr-pwa.dominosindia.in/jfl-discovery-ui/en/pwa/store/${card_item.data.id}?noredirect=true&store_id=${card_item.data.id}">Explore</a></div>
   
</div>`;
        cards += store;
    });

    let tempCards = document.getElementById("messagesList");
    tempCards.innerHTML += `<div id="store-location-cards"><div class="store-location-card-wrap">` + cards + `</div></div>`

    // let exploreBtns= document.getElementsByClassName("card-store-location-explore-btn");
    // for(let i=0;i<exploreBtns.length;i++){
    //     exploreBtns[i].addEventListener("click",()=>{
            
    //     })
    // }
}

export { showStoreLocationCards };