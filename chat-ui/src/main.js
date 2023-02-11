import { showOrderCards } from "./scripts/orderCards";
import { issueOptions } from "./scripts/Customer_Support/issueOptions";
import { productQualityOptionsMessage } from "./scripts/Customer_Support/productQualityOptions";
import { lateOrderOptionsMessage } from "./scripts/Customer_Support/lateOrderOptions";
import { refundProblemOptionsMessage } from "./scripts/Customer_Support/refundProblemOptions";
import { staffIssueOptionsMessage } from "./scripts/Customer_Support/staffIssueOptions";
import { rewardProblemOptionsMessage } from "./scripts/Customer_Support/rewardProblemOptions";
import { feedbackOptionsMessage } from "./scripts/Customer_Support/feedbackOptions";
import { wrongOrderOptionsMessage } from "./scripts/Customer_Support/wrongOrderOptions";
import { orderCancelledMessage } from "./scripts/Customer_Support/orderCancelledOptions";
import { showStoreLocationCards } from "./scripts/store_locator/storeLocationCards";
import {
	getProductCards,
	buildProductCard,
} from "./scripts/menu_flow/productCards";
import { showQuickReplyButton } from "./scripts/Quick_Reply/quickReplyButton";
import { showWalletInfoCard } from "./scripts/Wallet_Info/walletInfoCard";
import { showOfferCards } from "./scripts/Offer_Cards/offerCards";
import { getCategoryOptions } from "./scripts/menu_flow/categoryOptions";
import {
	showChatBubble,
	removeChatBubble,
} from "./scripts/Chat_Bubble/chatBubble";
import { showCheesyRewardCard } from "./scripts/Cheesy_Rewards/cheesyRewardCards";
import {
	buildMessage,
	getCookie,
	getHeaders,
	getSessionCookie
} from "./scripts/buildMessage";
import { quickReplies } from "./scripts/Quick_Reply/quickReplies";
import { getIssueListUCR } from "./scripts/Customer_Support/UCR/issueListUCR";
import logo from "../src/assets/images/Domino's_pizza_logo.png";
import axios from "axios";
import config from "./config/index";
import { initialQuickReplies } from "./scripts/initial_Quick_Replies";
import { getSubCategoryList } from "./scripts/Customer_Support/UCR/subCategoryList";
import { updateLoginInfo } from "./scripts/Login/UpdateLogin";
import { connectWithLiveAgent } from "./scripts/Live_Agent/connectAgent";
import { terminateLiveChat } from "./scripts/Live_Agent/terminateConnection";
const messageTypes = { LEFT: "left", RIGHT: "right", LOGIN: "login" };

//Chat stuff
const chatWindow = document.getElementById("mainContent");
// const mainContent=document.getElementById("mainContent");
// const chat=document.getElementById("chat");
const messagesList = document.getElementById("messagesList");
const messageInput = document.getElementById("messageInput");
const messageInputInitial = document.getElementById(
	"messageInputInitialQuickReply"
);
const sendBtn = document.getElementById("sendBtn");
const homeBtn = document.getElementById("homeBtn");
const popupBtn = document.getElementById("chat-popup-btn");
const appContainer = document.getElementById("appContainer");
const appContainerInitial = document.getElementById("appContainer-initial");
const chatCloseBtn = document.getElementById("closeChatBtn");
const chatCloseBtnInitial = document.getElementById("closeChatBtnInitial");
const sendBtnInitialQuickReply = document.getElementById(
	"sendBtnInitialQuickReply"
);
const chatBtnContainer = document.getElementsByClassName(
	"chat-popup-button-container"
)[0];
//login stuff
let username = '';
const messages = []; 

//Connect to socket.io - automatically tries to connect on same port app was served from
const options = {
	path: "/jfl-chat-ui/socket", //context path of api
	transports: ["websocket"],
	cors: {
		origin: "*", //hoisted api origin
		methods: ["GET", "POST"],
	},
};

const apiOrigin = config.DOMAIN;

const optionsLiveChat = {
	path: "/live-agent-helpdesk/socket",
	allowEIO3: true,
	transports: ["websocket"],
	cors: {
		origin: "*", //hoisted api origin
		methods: ["GET", "POST"],
	},
};

const apiOriginLiveChat = config.LIVE_AGENT_DOMAIN;

var socket = io(apiOrigin, options);
var socketLiveChat = io(apiOriginLiveChat,optionsLiveChat);
socket.on("message", (message) => {
	//Update type of message based on username
	console.log("message recieved at client......");
	if (message.type !== messageTypes.LOGIN) {
		if (message.author === username) {
			message.type = messageTypes.RIGHT;
		} else {
			message.type = messageTypes.LEFT;
		}
	}

	messages.push(message);
	displayMessages();

	//scroll to the bottom
	chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on("user_broadcast", function (response) {
	const dateString = getDateString();
	console.log("User Brodcast", response);
	removeChatBubble();
	if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.RIGHT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
});
socketLiveChat.on("user_broadcast", function (response) {
	const dateString = getDateString();
	response=response.content
	console.log("User Brodcast", response);
	removeChatBubble();
	if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.RIGHT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
});
socket.on("bot_uttered", function (response) {
	const quickReplyDiv = document.getElementById("quickReplyTab");
	quickReplyDiv.innerHTML = "";
	const dateString = getDateString();
	console.log("Bot Uttered", response);
	removeChatBubble();
	if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.LEFT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
	if (response.custom) {
		response = response.custom;
	}

	if (response.orders) {
		showOrderCards(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.issueOptions) {
		issueOptions(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.itemTypesOptions) {
		productQualityOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.lateOrderIssue) {
		lateOrderOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.refundProblemIssues) {
		refundProblemOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.staffBehaviourIssues) {
		staffIssueOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.rewardProblemIssues) {
		rewardProblemOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.feedbackOptions) {
		feedbackOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.wrongOrderIssue) {
		wrongOrderOptionsMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.orderCancelledIssue) {
		orderCancelledMessage(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.storeList) {
		showStoreLocationCards(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.product || response.products) {
		getProductCards(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.buttons) {
		showQuickReplyButton(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.walletHistory) {
		showWalletInfoCard(response.walletHistory);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.dominosOffers) {
		showOfferCards(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.categories) {
		getCategoryOptions(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.cheesyRewardHistory) {
		showCheesyRewardCard(response.cheesyRewardHistory);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.ucr_categories) {
		getIssueListUCR(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.ucr_sub_categories) {
		getSubCategoryList(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.loginInfo) {
		updateLoginInfo(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.displayMainMenu == true) {
		const initialResponse = quickReplies;
		console.log("intialRespo", initialResponse);
		showQuickReplyButton(initialResponse.quick_replies);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	} else if (response.connectWithLiveAgent == true) {
		console.log(response)
		connectWithLiveAgent(response,socketLiveChat);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
	else if(response.loginInfo){
		updateLoginInfo(response);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
	else if(response.displayMainMenu==true){
		const initialResponse = quickReplies;
		console.log("intialRespo",initialResponse)
		showQuickReplyButton(initialResponse.quick_replies);
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
});

socketLiveChat.on("live_agent_uttered_to_user",function(response){
	removeChatBubble();
	console.log("live agent uttered",response)
	const dateString = getDateString();
	if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.LEFT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
	if(response.liveAgentTerminate!==undefined){
		terminateLiveChat()
	}
	console.log("message from live agent",response.text)
})

function createUserMessageHTML(message) {
	return `
	<div class="message">
		<div class="box arrow-right">
			<p class="message-content">${message.text}</p>
			<p class="message-date">${message.date}</p>
		</div>
		<div class="chat-avatar-icon-user">
			You
		</div>
	</div>	
	`;
}

function createBotMessageHTML(message) {
	return `
	<div class="message">
		<div class="chat-avatar-icon">
			<img src="${logo}" class="chat-avatar-icon-img" alt="default image" height="50px" width="50px">
		</div>
		<div class="box arrow-left">
			<p class="message-content">${message.text}</p>
			<p class="message-date">${message.date}</p>
		</div>
	</div>	
	`;
}

function createMessageHTML(message) {
	// return `
	// <div class="message"><div class=" ${
	// 	message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
	// }">

	// 	<p class="message-content">${message.text}</p>
	// </div>
	// <p class="message-date-${message.type === messageTypes.LEFT ? 'left':'right'}">${message.date}</p>
	// </div>
	// `;

	return message.type === messageTypes.RIGHT
		? createUserMessageHTML(message)
		: createBotMessageHTML(message);
}

{
	/* <div class="message-details flex">
			  <p class="flex-grow-1 message-author">${
				  message.type === messageTypes.LEFT ? 'Bot' : 'User'
			  }</p>
			  <p class="message-date">${message.date}</p>
		  </div> */
}

function displayMessages() {
	const messagesHTML = messages
		.map((message) => createMessageHTML(message))
		.join("");
	messagesList.innerHTML = messagesHTML;
}

sendBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (!messageInput.value) {
		return console.log("Invalid input");
	}
	const dateString = getDateString();

	const messageSend = buildMessage({
		text: messageInput.value,
		type: messageTypes.RIGHT,
		data: {}
	});
	//console.log(messageSend)
	sendMessage(messageSend);
	//clear input
	messageInput.value = "";
});

sendBtnInitialQuickReply.addEventListener("click", (e) => {
	e.preventDefault();
	if (!messageInputInitial.value) {
		return console.log("Invalid input");
	}
	const dateString = getDateString();

	const messageSend = buildMessage({
		text: messageInputInitial.value,
		type: messageTypes.RIGHT,
		data: {},
	});
	//console.log(messageSend)
	sendMessage(messageSend);
	//clear input
	messageInput.value = "";
	messageInputInitial.value = "";
	appContainerInitial.style.display = "none";
	appContainer.style.display = "block";
});

homeBtn.addEventListener("click", (e) => {
	e.preventDefault();
	appContainerInitial.style.display = "block";
	appContainer.style.display = "none";
	// const quickMenuReplies= quickReplies;
	// showQuickReplyButton(quickMenuReplies);
});

popupBtn.addEventListener("click", () => {
	appContainerInitial.style.display = "block";
	popupBtn.style.display = "none";
	const initialResponse = quickReplies;
	messageInputInitial.value = "";
	// socket.emit('bot_uttered',initialResponse);
	initialQuickReplies();
	chatWindow.scrollTop = chatWindow.scrollHeight;
});

chatCloseBtn.addEventListener("click", () => {
	appContainer.style.display = "none";
	appContainerInitial.style.display = "block";
	popupBtn.style.display = "none";
});

chatCloseBtnInitial.addEventListener("click", () => {
	appContainer.style.display = "none";
	appContainerInitial.style.display = "none";
	popupBtn.style.display = "block";
});

const chatboxHeaderTitle = document.getElementsByClassName(
	"chat-box-header-title"
);
const chatboxHeaderTitleFirstName = getCookie("chatFirstName") || "";
const chatboxHeaderTitleLastName = getCookie("chatLastName") || "";
if (chatboxHeaderTitleFirstName !== "" && chatboxHeaderTitleLastName !== "") {
	for (let i = 0; i < chatboxHeaderTitle.length; i++) {
		chatboxHeaderTitle[i].innerHTML =
			"Hi " +
			chatboxHeaderTitleFirstName +
			" " +
			chatboxHeaderTitleLastName +
			"!";
	}
}

function sendMessage(message) {
	document.getElementById("quickReplyTab").innerHTML = "";
	document
		.getElementById("messageInput")
		.setAttribute("placeholder", "type here...");
	// messagesList.style.height='calc(650px - 80px - 100px)';
	// mainContent.style.height=messagesList.style.height;
	// chat.style.height=messagesList.style.height;
	console.log("getCookie('chatLiveAgentRedirect')",getCookie("chatLiveAgentRedirect"))
	if(getCookie("chatLiveAgentRedirect")=="true"){
		let messageObj={
			content:message,
			sendTo:getCookie("chatLiveAgentId"),
			from: getSessionCookie(),
			userid: getCookie("chatUserId") || ""
		
		}
		socketLiveChat.emit("user_uttered_to_live_agent",messageObj)
	}
	else{
		console.log("emitting from socket")
		socket.emit("user_uttered", message);
	}
	messages.push(message);
	displayMessages(message);
	console.log(message);
	showChatBubble();
	setTimeout(removeChatBubble,3000);
	//scroll to the bottom
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getDateString(timestamp = null) {
	let date = new Date();
	if (timestamp !== null) {
		date = new Date(timestamp * 1000);
	}
	var strArray = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var text = "" + y + "-" + m + "-" + (d <= 9 ? "0" + d : d);
	var { 0: year, 1: month, 2: day } = text.split("-");
	let daySuffix =
		(day >= 4 && day <= 20) || (day >= 24 && day <= 30)
			? "th"
			: ["st", "nd", "rd"][(day % 10) - 1];
	let monthList = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sept",
		"Oct",
		"Nov",
		"Dec",
	];
	let dayPrefix = "";
	let monthPrefix = "";
	if (Number(day) < 10) {
		dayPrefix = "0";
	}
	if (Number(month) < 10) {
		monthPrefix = "0";
	}
	let dateString =
		dayPrefix + Number(day) + "." + monthPrefix + month + "." + year.slice(-2);
	return dateString;
}
// error logging
socket.io.on("error", (error) => {
	console.log("error in socket io client...", error + "..eof");
});
socketLiveChat.on("connect", ()=> {
	console.log(`Connected to live chat server with grpId: ${getSessionCookie()}`);
	socketLiveChat.emit("client_joined",getSessionCookie())
})
socket.on("connect", async () => {
	console.log("connected to server");
	socket.emit("client_joined",getSessionCookie())
	axios
		.get(config.DOMAIN + "/nextgen-consumer/ve/v1/chat-messages", {
			params: {
				chat_session_id: getSessionCookie(),
			},
			timeout: 5 * 1000,
		})
		.then(function (response) {
			console.log(response, "response");
			response.data.map((message) => {
				if (message.text) {
					message.type =
						message.event === "bot" ? messageTypes.LEFT : messageTypes.RIGHT;
					message.date = getDateString(message.timestamp);
					messages.push(message);
				}
			});

			displayMessages(messages);
		})
		.then(function () {
			//const initialResponse = quickReplies;
			// socket.emit('bot_uttered',initialResponse);
			//showQuickReplyButton(initialResponse);
			chatBtnContainer.style.display = "block";
			chatWindow.scrollTop = chatWindow.scrollHeight;
		})
		.catch(function (error) {
			console.log(error, "could not get prev conversations");
			chatBtnContainer.style.display = "block";
		});
});
socket.on("connect_error", (err) => {
	console.log("connect_error===>", err);
	console.log(err.req); // the request object
	console.log(err.code); // the error code, for example 1
	console.log(err.message); // the error message, for example "Session ID unknown"
	console.log(err.context); // some additional error context
});

socketLiveChat.on("connect_error", (err) => {
	console.log("connect_error: live agent socket===>", err);
	console.log(err.req); // the request object
	console.log(err.code); // the error code, for example 1
	console.log(err.message); // the error message, for example "Session ID unknown"
	console.log(err.context); // some additional error context
});

export { sendMessage, getDateString, messageTypes, createMessageHTML };
