import { buildMessage } from "../../buildMessage";
import { sendMessage } from "../../../main";
import { messageTypes } from "../../../main";
import { getIssueDescriptionBox } from "../issueDescriptionBox";
function getSubCategoryList(response) {
  response.type =
    response.ucr_sub_categories.isSingleValue == 1 ? "radio" : "checkbox";
  const chatWindow = document.getElementById("messagesList");
  let messagesList = document.getElementById("messagesList");
  let subCategoryData = "";
  response.ucr_sub_categories.subCategories.map((item) => {
    //console.log(item)
//     let subCategoryOptionBtn = `<div class="subCategoryUCR-options-btn-container"> 
//   <div class="chat-${response.type}-wrapper"><label class="chat-${response.type}"><input type="${response.type}" class="subCategoryUCR-option-btn subCategoryUCR-option-btn-data chat-${response.type}" id="subCategoryUCR-option-btn-id-${item.id}" name="subCategoryUCR-option-items" value="${item.id}">
//       <label for=${item.id}>${item.displayText}</label></label></div>
//   </div>`;

let subCategoryOptionBtn =`<div class="subCategoryUCR-options-btn-container"> <label class="chat-${response.type}">
<input type="radio" class="subCategoryUCR-option-btn subCategoryUCR-option-btn-data" id="subCategoryUCR-option-btn-id-${item.id}" name="subCategoryUCR-option-items" value="${item.id}"/>


<i><span></span></i>
<span class="labl-txt" >${item.displayText}
  </span>
</label></div>`
    subCategoryData += subCategoryOptionBtn;
  });
  if (response.type == "checkbox") {
    let subCategoryOptionBtn = `<div class="subCategoryUCR-options-btn-container"> <label class="chat-${response.type}">
      <input type="${response.type}" class="subCategoryUCR-option-btn chat-${response.type}" id="subCategoryUCR-option-selectAll" name="subCategoryUCR-option-items" value="Select All" ">
      <i><span></span></i>
<span class="labl-txt" >Select All
  </span>
</label>
      </div>`;
    subCategoryData += subCategoryOptionBtn;
  }
  let itemsList = "";

  if (
    response.ucr_sub_categories.hasOwnProperty("items") &&
    response.ucr_sub_categories.items.length > 0
  ) {
    itemsList = `<div class="order-item-UCR-header">
      								<p>Please select items from the list below</p>
                  </div>
      `;
    response.ucr_sub_categories.items.map((item) => {
      let itemData = `
        	<div class="order-item-UCR-list-item""><label class="chat-checkbox">
          	<input type="checkbox" class="subCategoryUCR-order-item-btn subCategoryUCR-order-item-btn-data chat-checkbox" id="order-item-UCR-id-${item.product.id}" name="subCategoryUCR-option-order-items" value="${item.product.id}">
              <i><span></span></i>
              <span class="labl-txt" >${item.product.name}
  </span>
</label>
      </div>
        `;
      itemsList += itemData;
    });

    itemsList += `<div class="subCategoryUCR-order-item-btn-select-all"><label class="chat-checkbox">
      	<input type="checkbox" class="subCategoryUCR-order-item-btn chat-checkbox" id="subCategoryUCR-option-order-items-selectAll" name="subCategoryUCR-option-order-items" value="Select All" ">
      <i><span></span></i>
              <span class="labl-txt" >Select All
  </span>
</label>
</div>
      `;
  }

  let itemsDataContainer =
    `
    	<div class="subCategoryUCR-order-items-container" style="display:none">
      ` +
    itemsList +
    `
      </div>
    `;
  messagesList.innerHTML +=
    `<div class="subCategoryUCR-issue-wrap">` +
    subCategoryData +
    itemsDataContainer +
    getIssueDescriptionBox() +
    `<button id="subCategoryUCR-submit-btn" class="chat-submit-btn" hidden="hidden">Submit</button></div>`;

  if (response.type == "checkbox") {
    let selectAllSubCategory = document.getElementById(
      "subCategoryUCR-option-selectAll"
    );
    selectAllSubCategory.addEventListener("click", function () {
      let subCategoryOptionBtns = document.getElementsByClassName(
        "subCategoryUCR-option-btn"
      );
      for (let i = 0; i < subCategoryOptionBtns.length; i++) {
        subCategoryOptionBtns[i].checked = selectAllSubCategory.checked;
      }
    });
  }
  if (
    response.ucr_sub_categories.hasOwnProperty("items") &&
    response.ucr_sub_categories.items.length > 0
  ) {
    let selectAllItems = document.getElementById(
      "subCategoryUCR-option-order-items-selectAll"
    );
    selectAllItems.addEventListener("click", function () {
      let itemOptionBtns = document.getElementsByClassName(
        "subCategoryUCR-order-item-btn"
      );
      for (let i = 0; i < itemOptionBtns.length; i++) {
        itemOptionBtns[i].checked = selectAllItems.checked;
      }
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    let itemOptionBtns = document.getElementsByClassName(
      "subCategoryUCR-order-item-btn"
    );
    for (let i = 0; i < itemOptionBtns.length; i++) {
      itemOptionBtns[i].addEventListener("click", () => {
        let countOrderItems = 0;
        let countSubCategoryBtns = 0;
        let subCategoryOptionBtns = document.getElementsByClassName(
          "subCategoryUCR-option-btn"
        );
        for (let j = 0; j < itemOptionBtns.length; j++) {
          if (itemOptionBtns[j].checked == true) {
            countOrderItems++;
          }
        }
        for (let j = 0; j < subCategoryOptionBtns.length; j++) {
          if (subCategoryOptionBtns[j].checked == true) {
            countSubCategoryBtns++;
          }
        }
        if (countOrderItems > 0 && countSubCategoryBtns > 0) {
          const submitBtn = document.getElementById(
            "subCategoryUCR-submit-btn"
          );
          submitBtn.removeAttribute("hidden");
        }
        else{
            submitBtn.setAttribute("hidden","hidden")
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
      });
    }
  }

  let subCategoryOptionBtns = document.getElementsByClassName(
    "subCategoryUCR-option-btn"
  );
  for (let i = 0; i < subCategoryOptionBtns.length; i++) {
    subCategoryOptionBtns[i].addEventListener("click", function () {
      const OrderItemsContainer = document.getElementsByClassName(
        "subCategoryUCR-order-items-container"
      )[0];
      const submitBtn = document.getElementById("subCategoryUCR-submit-btn");
      let countSubCategoryBtns = 0;
      for (let j = 0; j < subCategoryOptionBtns.length; j++) {
        if (subCategoryOptionBtns[j].checked == true) {
          countSubCategoryBtns++;
        }
      }
      if (countSubCategoryBtns > 0) {
        if (
          response.ucr_sub_categories.hasOwnProperty("items") &&
          response.ucr_sub_categories.items.length > 0
        ) {
          OrderItemsContainer.style.display = "block";
        } else {
          submitBtn.removeAttribute("hidden");
        }
      } else {
        let itemOptionBtns = document.getElementsByClassName(
          "subCategoryUCR-order-item-btn"
        );
        for (let i = 0; i < itemOptionBtns.length; i++) {
          itemOptionBtns[i].checked = false;
        }
        OrderItemsContainer.style.display = "none";
        submitBtn.setAttribute("hidden", "hidden");
      }
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }

  let submitBtn = document.getElementById("subCategoryUCR-submit-btn");
  submitBtn.addEventListener("click", function () {
    let subCategoryOptionBtns = document.getElementsByClassName(
      "subCategoryUCR-option-btn-data"
    );
    let subCategoryOptionBtnsSelected = [];
    let itemOptionBtnsSelected = [];
    for (let i = 0; i < subCategoryOptionBtns.length; i++) {
      if (subCategoryOptionBtns[i].checked == true) {
        let subCategoryOptionBtnsSelectedId = subCategoryOptionBtns[
          i
        ].id.substring(subCategoryOptionBtns[i].id.lastIndexOf("-") + 1);
        console.log(
          "subCategoryOptionBtnsSelectedId",
          subCategoryOptionBtnsSelectedId
        );
        subCategoryOptionBtnsSelected.push(subCategoryOptionBtnsSelectedId);
      }
    }
    if (
      response.ucr_sub_categories.hasOwnProperty("items") &&
      response.ucr_sub_categories.items.length > 0
    ) {
      let itemOptionBtns = document.getElementsByClassName(
        "subCategoryUCR-order-item-btn-data"
      );
      for (let i = 0; i < itemOptionBtns.length; i++) {
        if (itemOptionBtns[i].checked == true) {
          let itemOptionBtnsSelectedId = itemOptionBtns[i].id.substring(
            itemOptionBtns[i].id.lastIndexOf("-") + 1
          );
          console.log("itemOptionBtnsSelected", itemOptionBtnsSelectedId);
          itemOptionBtnsSelected.push(itemOptionBtnsSelectedId);
        }
      }
    }
    const messageSend = buildMessage({
      text: "Feedback Submitted,",
      type: messageTypes.RIGHT,
      data: {
        ucr_sub_category_id: subCategoryOptionBtnsSelected,
        itemOptionBtnsSelected: itemOptionBtnsSelected,
        descriptionMessage: document.getElementById("issue_description").value,
      },
    });
    document.getElementsByClassName("subCategoryUCR-issue-wrap")[0].remove();
    sendMessage(messageSend);
  });
  if (response.type == "checkbox") {
    let subCategoryOptionBtnsData = document.getElementsByClassName(
      "subCategoryUCR-option-btn-data"
    );
    for (let i = 0; i < subCategoryOptionBtnsData.length; i++) {
      subCategoryOptionBtnsData[i].addEventListener("click", () => {
        let allSubCategoryChecked = true;
        for (let j = 0; j < subCategoryOptionBtnsData.length; j++) {
          if (subCategoryOptionBtnsData[j].checked == false) {
            allSubCategoryChecked = false;
            break;
          }
        }
        let selectAllSubCategory = document.getElementById(
          "subCategoryUCR-option-selectAll"
        );
        selectAllSubCategory.removeEventListener("click",()=>{});
        selectAllSubCategory.checked = allSubCategoryChecked;
        selectAllSubCategory.addEventListener("click", function () {
          let subCategoryOptionBtns = document.getElementsByClassName(
            "subCategoryUCR-option-btn"
          );
          for (let i = 0; i < subCategoryOptionBtns.length; i++) {
            subCategoryOptionBtns[i].checked = selectAllSubCategory.checked;
          }
        });
      });
    }
  }

  if (
    response.ucr_sub_categories.hasOwnProperty("items") &&
    response.ucr_sub_categories.items.length > 0
  ) {
    let itemOptionBtnsData = document.getElementsByClassName(
      "subCategoryUCR-order-item-btn-data"
    );
    for (let i = 0; i < itemOptionBtnsData.length; i++) {
      itemOptionBtnsData[i].addEventListener("click", () => {
        let allItemOptionChecked = true;
        for (let j = 0; j < itemOptionBtnsData.length; j++) {
          if (itemOptionBtnsData[j].checked == false) {
            allItemOptionChecked = false;
            break;
          }
        }
        let selectAllItems = document.getElementById(
            "subCategoryUCR-option-order-items-selectAll"
          );
          selectAllItems.removeEventListener("click",()=>{});
          selectAllItems.checked = allItemOptionChecked;
          selectAllItems.addEventListener("click", function () {
            let itemOptionBtns = document.getElementsByClassName(
              "subCategoryUCR-order-item-btn"
            );
            for (let i = 0; i < itemOptionBtns.length; i++) {
              itemOptionBtns[i].checked = selectAllItems.checked;
            }
            chatWindow.scrollTop = chatWindow.scrollHeight;
          });
      })
    };
  }

}

export { getSubCategoryList };
