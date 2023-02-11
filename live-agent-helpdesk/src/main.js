import axios from "axios";
import { io } from "socket.io-client";
import { setCookieWithValue,getCookie,setCookie, deleteCookie } from "./cookies";
import { buildMessage } from "./buildMessage";
import logo from "../src/assets/images/Domino's_pizza_logo.png";
import Swal from 'sweetalert2'



const messageTypes = { LEFT: "left", RIGHT: "right", LOGIN: "login" };
//Chat stuff
const chatWindow = document.getElementById("mainContent");
// const mainContent=document.getElementById("mainContent");
// const chat=document.getElementById("chat");
const messagesList = document.getElementById("messagesList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const popupBtn = document.getElementById("chat-popup-btn");
const appContainer = document.getElementById("appContainer");
const conversationEndBtn = document.getElementById("conversationEndBtn")
const closeChatBtn = document.getElementById("closeChatBtn")
const CONFIG = require("./config/config").CONFIG
const CONTEXT_PATH = require("./config/config").CONTEXT_PATH

const messages = [];
const options = {
	path: "/live-agent-helpdesk/socket",
	allowEIO3: true,
	transports: ["websocket"],
	cors: {
		origin: "*", //hoisted api origin
		methods: ["GET", "POST"],
	},
};

const apiOrigin = CONFIG.DOMAIN;

var socketLiveAgent = io(apiOrigin,options);

if(getCookie('chatCustomerId')){
	enableConversationEndBtn();
}
else{
	disableConversationEndBtn();
}


if(getCookie("chatCustomerId") && getCookie("chatCustomerInfo")){
	console.log("enab;e");
	enableUserInfo();
}
socketLiveAgent.on("connect_user_and_live_agent",function (messageObj){
    console.log("connect user and live agent object",messageObj)
    setCookieWithValue("chatCustomerId",messageObj.userChatSessionId,1/24);
    console.log("connect user and live agent",messageObj.content);
	let response ={}
	let chatCustomerInfo={};
	if(messageObj?.userInfo?.firstName && messageObj?.userInfo?.lastName){
		chatCustomerInfo.userInfo = messageObj.userInfo
		setCookieWithValue("chatCustomerInfo",JSON.stringify(chatCustomerInfo),1/24)
		response.text = "You are now connected with the " + messageObj?.userInfo?.firstName + " " + messageObj?.userInfo?.lastName;
	}
	else if(messageObj?.userInfo?.firstName){
		chatCustomerInfo.userInfo = messageObj.userInfo
		setCookieWithValue("chatCustomerInfo",JSON.stringify(chatCustomerInfo),1/24)
		response.text = "You are now connected with the " + messageObj?.userInfo?.firstName;
	}
	else{
		setCookieWithValue("chatCustomerInfo","guest",1/24)
		response.text = "You are now connected with the guest user";
	}
	enableUserInfo();
	const quickReplyDiv = document.getElementById("quickReplyTab");
	quickReplyDiv.innerHTML = "";
	const customerInfoDiv = document.getElementsByClassName("customer-info-wrap")[0];
	customerInfoDiv.innerHTML =response.text;
	const dateString = getDateString();
	console.log("Bot Uttered", response);
	enableConversationEndBtn();
	//removeChatBubble();
    // if (response.text !== undefined) {
	// 	response.message = response.text;
	// 	response.date = dateString;
	// 	response.type = messageTypes.LEFT;
	// 	messages.push(response);
	// 	displayMessages();
	// 	//scroll to the bottom
	// 	chatWindow.scrollTop = chatWindow.scrollHeight;
	// }
});

socketLiveAgent.on("live_agent_uttered_to_user_broadcast",function (message){
    console.log("broadcast live agent",message)
    messages.push(message);
	displayMessages(message);
	console.log(message);
});

socketLiveAgent.on("isAvailable", (arg, callback) => {
	// send callback after confirmation
	console.log("isAvailable",arg);

	let timerInterval
	Swal.fire({
		title: 'Are you sure?',
		text: "User wants to connect with you",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, connect me!',
	timer: 15000,
	}).then((result) => {
	/* Read more about handling dismissals below */
	if (result.isConfirmed) {
		console.log("pressed ok");
		callback({connect:true});
		messages.splice(0,messages.length);
	} else {
		callback({connect:false});
	}
	})



	// if(confirm("User want to connect with you. Are you available to take the call?")===true){
		
	// }
	// else{
	// 	callback({connect:false});
	// }
	
  });
socketLiveAgent.on("connection_ended",function(response){
	const quickReplyDiv = document.getElementById("quickReplyTab");
	quickReplyDiv.innerHTML = "";
	const dateString = getDateString();
	console.log("Bot Uttered", response);
	//removeChatBubble();
    if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.LEFT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
	disableConversationEndBtn();
	disableUserInfo();
});

socketLiveAgent.on("user_uttered_to_live_agent",function(response){
    const quickReplyDiv = document.getElementById("quickReplyTab");
	quickReplyDiv.innerHTML = "";
	const dateString = getDateString();
	console.log("Bot Uttered", response);
	//removeChatBubble();
    if (response.text !== undefined) {
		response.message = response.text;
		response.date = dateString;
		response.type = messageTypes.LEFT;
		messages.push(response);
		displayMessages();
		//scroll to the bottom
		chatWindow.scrollTop = chatWindow.scrollHeight;
	}
})
const loginFormContainer = document.getElementsByClassName("login-form")[0];
const loginForm = document.getElementsByClassName("helpdesk-login-form")[0];
if(getCookie('isLoggedIn') && getCookie('chatLiveAgentSessionId')){
	loginFormContainer.style.display="none";
    appContainer.style.display="block";
	socketLiveAgent.emit("agent_joined_helpdesk",getCookie('chatLiveAgentSessionId'));
}
loginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const email = document.getElementById("input-field-email");
	const password = document.getElementById("input-field-password");
    if(!email.value || !password){
        console.log("Invalid Input");
    }
    else{
        let result = await axios.post(`${CONFIG.DOMAIN}/${CONTEXT_PATH}/api/agent/login`,{
            email:email.value,
			password: password.value

        }).then(function(response){
			response = response.data
            socketLiveAgent.emit("agent_joined_helpdesk",response.agent.id);
            setCookieWithValue("chatLiveAgentSessionId",response.agent.id);
			setCookieWithValue("isLoggedIn",true);
            loginFormContainer.style.display="none";
            appContainer.style.display="block";
        }).catch(function(error){
            console.log("Incorrect login credentials",error);
        })
    }
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

function createAgentMessageHTML(message) {
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
    console.log("create Message",message)
	return message.type === messageTypes.RIGHT
		? createUserMessageHTML(message)
		: createAgentMessageHTML(message);
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
		data: {},
	});
	//console.log(messageSend)
	sendMessage(messageSend);
	//clear input
	messageInput.value = "";
});

closeChatBtn.addEventListener("click", () => {
	if(!getCookie("chatCustomerId")){
		axios.get(`${CONFIG.DOMAIN}/${CONTEXT_PATH}/api/logout?agent_id=${getCookie("chatLiveAgentSessionId")}`,
    ).then(function(){
        appContainer.style.display = "none";
		loginFormContainer.style.display="block";
        
    }).then(function(){
		deleteCookie("chatLiveAgentSessionId");
		deleteCookie("isLoggedIn")
        console.log("Logged out successfully")
    }).catch(function(error){
        console.log(`Unable to logout: ${error}`,)
    })
	}
	
});

popupBtn.addEventListener("click", () => {
	appContainerInitial.style.display = "block";
	popupBtn.style.display = "none";
	chatWindow.scrollTop = chatWindow.scrollHeight;
});

conversationEndBtn.addEventListener("click",()=>{
    axios.get(`${CONFIG.DOMAIN}/${CONTEXT_PATH}/api/updateStatusToActive?agent_id=${getCookie("chatLiveAgentSessionId")}`,
    ).then(function(response){
        messages.splice(0,messages.length);
        socketLiveAgent.emit("live_agent_uttered_to_user",{"text":"Conversation with the agent has ended","liveAgentTerminate":true,"sendTo":getCookie("chatCustomerId"),"from":getCookie("chatLiveAgentSessionId")})
        socketLiveAgent.emit("connection_ended",{"sendTo":getCookie('chatLiveAgentSessionId')})
    }).then(function(response){
        deleteCookie("chatCustomerId")
		deleteCookie("chatCustomerInfo")
		disableUserInfo();
        console.log("conversation with the user has ended")
    }).catch(function(error){
        console.log("agent issue resolved error",error)
    })
})
function sendMessage(message) {
	document.getElementById("quickReplyTab").innerHTML = "";
	document
		.getElementById("messageInput")
		.setAttribute("placeholder", "type here...");
	// messagesList.style.height='calc(650px - 80px - 100px)';
	// mainContent.style.height=messagesList.style.height;
	// chat.style.height=messagesList.style.height;
	// console.log("getCookie('chatLiveAgentRedirect')",getCookie("chatLiveAgentRedirect"))
	message.sendTo=getCookie("chatCustomerId")
    message.from=getCookie("chatLiveAgentSessionId")
    socketLiveAgent.emit("live_agent_uttered_to_user",message)
	messages.push(message);
	displayMessages(message);
	console.log(message);
	//showChatBubble();
	//scroll to the bottom
	chatWindow.scrollTop = chatWindow.scrollHeight;
}

function enableConversationEndBtn(){
	conversationEndBtn.style.display = "block";
}


function disableConversationEndBtn(){
	conversationEndBtn.style.display = "none";
}

function enableUserInfo(){
	let text="";
	if(getCookie("chatCustomerInfo") && getCookie("chatCustomerInfo")!=="guest"){
		let chatCustomerInfo = getCookie("chatCustomerInfo");
		chatCustomerInfo = JSON.parse(chatCustomerInfo);
		if(chatCustomerInfo?.userInfo){
			let name="";
			if(chatCustomerInfo?.userInfo?.firstName && chatCustomerInfo?.userInfo?.lastName){
				name = chatCustomerInfo?.userInfo?.firstName + " " + chatCustomerInfo?.userInfo?.lastName;
			}
			else if(chatCustomerInfo?.userInfo?.firstName){
				name = chatCustomerInfo?.userInfo?.firstName;
			}
			text = "You are now connected with " + name;
		}
		else{
			text = "You are now connected with guest user";
		}
	}
	else if(getCookie("chatCustomerInfo")=="guest"){
		text = "You are now connected with guest user";	
	}
	
	const customerInfoDiv = document.getElementsByClassName("customer-info-wrap")[0];
	customerInfoDiv.innerHTML =text;
}

function disableUserInfo(){
	const customerInfoDiv = document.getElementsByClassName("customer-info-wrap")[0];
	customerInfoDiv.innerHTML = "";
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