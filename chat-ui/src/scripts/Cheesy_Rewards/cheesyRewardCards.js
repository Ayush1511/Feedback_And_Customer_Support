import { sendMessage, getDateString, messageTypes, createMessageHTML } from "../../main"
import { headers } from "../headers";

function millisToDate(timestamp) {
    const date = new Date(timestamp);
    // console.log(date.toLocaleDateString('en-UK'));
    return date.toString()
}

function showCheesyRewardCard(response) {
    let messagesList = document.getElementById("messagesList");
    
    let walletDetails = `<div class="wallet-body"><div class="wallet-point">
                        <p class="card-text">Refund Points</p>
                        <h5 class="card-title">${response.overall.points} Points</h5>
                        <p class="card-text">600 Points = 1 Pizza</p>
                    </div></div>`;

    let tableStructure = ``;
    
    if(response.data.length > 0) {
        let tableRows = ``;

        response.data.map((item) => {
            let transactionDate = millisToDate(item.transactionDate).slice(4, 15);
            let expiryDate = millisToDate(item.expiryDate).slice(4, 15);

            tableRows += `<tr>
                            <td>
                                <div>
                                    <p>${transactionDate}</p>
                                    <p>Order id: ${item.orderDetails.orderId}</p>
                                    <p>Order Amount: ${item.orderDetails.orderAmont}</p>
                                </div>
                            </td>
                            <td>
                                <div class="wallet-points">
                                    <p>+${item.amountCredited}</p>
                                    <p>Expiry: ${expiryDate}</p>
                                </div>
                            </td>
                            <td>
                                <div class="wallet-points">
                                    <p>-</p>
                                </div>
                            </td>
                        </tr>`;

        })

        tableStructure = `<table class="wallet-table"><tr class="wallet-table-header">
            <th>Transaction</th>
            <th>Earned</th>
            <th>Used</th></tr>` + tableRows +`</table>`;
    }
    else {
        tableStructure = `<div class="wallet-no-history">No History Available</div>`;
    }

    let wallet = `<div class="wallet-wrapper">` + walletDetails + tableStructure + `</div>`;

    messagesList.innerHTML += wallet;
}

export { showCheesyRewardCard }