function showOfferCards(response) {
    let messagesList = document.getElementById("messagesList");
    let offerCards = ``;
    let paymentOfferCards = ``;

    

    response.dominosOffers.paymentOffers.paymentOffers.data.map((item) => {
        paymentOfferCards += `<div class="chat-offer-card">
        <div class="chat-offer-header">
        	<div class="chat-offer-title">${item.paymentLabel}</div>
          <div class="chat-offer-corner-image"><img src="https://images.dominos.co.in/${item.iconUrl}"></div>
        </div>
        <div class="chat-offer-body">
        	<p class="chat-offer-body-description">${item.description}</p>
        </div>
        <div class="chat-offer-footer">
        </div>
    </div>`
    })




    let paymentOffer = `<h4>Payment Offers</h4><div class="chat-offer-scroll">` + paymentOfferCards +`</div>`;
    
    messagesList.innerHTML += `<div class="chat-offer-wrapper">` + paymentOffer +`</div>`;
   
}

export { showOfferCards }