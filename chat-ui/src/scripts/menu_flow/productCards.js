
import nonveg from "../../assets/images/non-veg.png"
import veg from "../../assets/images/veg.png"
import { getHeaders } from "../buildMessage.js";
function getProductCards(response) {
    let messagesList = document.getElementById("messagesList");
    let card = `<div class='menu-flow-product-cards'>`
    //console.log("Inside getproductCards");
    if (response.products !== undefined) {
        response.products.map((product) => {
            card += buildProductCard(product);
        });
    }
    else if (response.product !== undefined) {
        card += buildProductCard(response.product);
    }
    card += `</div>`
    messagesList.innerHTML += `<div class="menu-flow-product-cards-wrap">` + card + `</div>`


    let menuFlowProductCardAddBtns = document.getElementsByClassName("menu-flow-product-card-add-btn");
    for (let i = 0; i < menuFlowProductCardAddBtns.length; i++) {
        menuFlowProductCardAddBtns[i].addEventListener('click', () => {
            console.log("inside product card add cta click");
            // menuFlowProductCardAddBtns[i].style.display = "none";
            // let menuFlowProductCardQuantityBtnContainer = menuFlowProductCardAddBtns[i].closest(".menu-flow-product-card").querySelector(".menu-flow-product-card-quantity-btn-container");
            // //console.log(menuFlowProductCardQuantityBtnContainer);
            // menuFlowProductCardQuantityBtnContainer.style.display = "flex";
            // let menuFlowProductCardQuantityBtn = menuFlowProductCardQuantityBtnContainer.querySelector(".menu-flow-product-card-quantity")
            // menuFlowProductCardQuantityBtn.innerHTML = 0;
            // menuFlowProductCardQuantityBtn.innerHTML = parseInt(menuFlowProductCardQuantityBtn.innerHTML) + 1;
            let productId = menuFlowProductCardAddBtns[i].closest(".menu-flow-product-card").id;
            console.log(productId);
            let url = "https://s3-csr-pwa.dominosindia.in/jfl-discovery-ui/en/pwa/store/"
            let storeId = getHeaders().storeid;
            //console
            console.log(url + storeId + "?product_id=" + productId + "&action=add&ref=chatui&store_id="+storeId);
            window.location = url + storeId + "?productId=" + productId + "&action=add&ref=chatui&store_id="+storeId;
        })
    }

    // let menuFlowProductCardQtyAddBtn = document.getElementsByClassName("menu-flow-product-card-quantity-btn-add");
    // let menuFlowProductCardQtyRemoveBtn = document.getElementsByClassName("menu-flow-product-card-quantity-btn-remove");
    // for (let i = 0; i < menuFlowProductCardQtyAddBtn.length; i++) {
    //     menuFlowProductCardQtyAddBtn[i].addEventListener("click", () => {
    //         let qtyBtn = menuFlowProductCardQtyAddBtn[i].closest(".menu-flow-product-card-quantity-btn-container").querySelector(".menu-flow-product-card-quantity");
    //         qtyBtn.innerHTML = parseInt(qtyBtn.innerHTML)+1;

    //         //window.location = ""
    //     })
    // }
    // for (let i = 0; i < menuFlowProductCardQtyRemoveBtn.length; i++) {
    //     menuFlowProductCardQtyRemoveBtn[i].addEventListener("click", () => {
    //         let qtyBtn = menuFlowProductCardQtyRemoveBtn[i].closest(".menu-flow-product-card-quantity-btn-container").querySelector(".menu-flow-product-card-quantity");
    //         qtyBtn.innerHTML = parseInt(qtyBtn.innerHTML)-1;
    //         if(parseInt(qtyBtn.innerHTML) == 0) {
    //             let menuFlowProductCardQuantityBtnContainer = menuFlowProductCardQtyRemoveBtn[i].closest(".menu-flow-product-card-quantity-btn-container");
    //             let menuFlowProductCardAddButton = menuFlowProductCardQtyRemoveBtn[i].closest(".menu-flow-product-card").querySelector(".menu-flow-product-card-add-btn");
    //             //console.log(menuFlowProductCardAddButton, "menuFlowProductCardAddButton");
    //             menuFlowProductCardQuantityBtnContainer.style.display="none";
    //             menuFlowProductCardAddButton.style.display="block";
    //         }
    //     })
    // }

}


function buildProductCard(product) {
    let myCard = "";
    myCard += `<div class="menu-flow-product-card" id="${product.id}">`
    myCard += `<div class="menu-flow-product-card-body">`
    myCard += `<div class="menu-flow-product-card-img-wrap"><img src="https://images.dominos.co.in/${product.image}" class="menu-flow-product-card-img" alt="default image" height="270px" width="360px"></div>`
    myCard += `<div class="menu-flow-product-card-details">`
    myCard += `<div class="menu-flow-product-card-title">`
    let productTypeIcon = nonveg;
    if (product.productType == 0) {
        productTypeIcon = veg;
    }
    myCard += `<div class="menu-flow-product-card-type-img-wrap"><img src=${productTypeIcon} class="menu-flow-product-card-type-img" alt="default image" height="20px" width="20px"></div>`
    myCard += `<div class="menu-flow-product-card-name"><p>${product.name}</p></div>`
    myCard += `</div>` //title ending
    myCard += `<div class="menu-flow-product-card-description"><p>${product.description}</p></div>`
    myCard += `</div>` //details ending
    myCard += `</div>`//body ending
    myCard += `<div class="menu-flow-product-card-footer"><p>&#x20B9 ${product.defaultPrice + product.defaultCrustPrice}</p>`
    myCard += `<button class="menu-flow-product-card-add-btn">Add+</button>`
    myCard += `<div class="menu-flow-product-card-quantity-btn-container">`
    myCard += `<button class="menu-flow-product-card-quantity-btn-remove">-</button>`
    myCard += `<div class="menu-flow-product-card-quantity" value=0>0</div>`
    myCard += `<button class="menu-flow-product-card-quantity-btn-add">+</button>`
    myCard += `</div>`
    myCard += `</div>`
    myCard += `</div>`// card ending
    //console.log(myCard)
    return myCard

}
export { getProductCards, buildProductCard };

