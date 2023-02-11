
function getHeaders() {
    let headers={
        client_type: "web app-chrome",
        storeid: "6585R",
        api_key: "d2aeb489bb8df385",
        "content-type":"application/json",
        "source": "PWA18#upsellC",
        "authtoken":getCookie("chatAccessToken") || "",
        "userid": getCookie("chatUserId") || ""
    }
    return headers;
}

function setCookie(cname, exdays) {
    let cvalue = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36)
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return cvalue
  }
  
  function setCookieWithValue(cname, cvalue ,exdays) {
    if(cvalue==""){
        console.log("cannot set cookie with null value")
        return;
    }
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getSessionCookie() {
    return getCookie('chatSessionId') || setCookie('chatSessionId',1);
  }

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function deleteCookie(name) {
    if(document.cookie!==undefined)
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

function buildMessage(payload){
    const messageInput = document.getElementById('messageInput');
    
    
    const date = new Date();
	var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	var text = '' + y+'-'+m+'-'+(d <= 9 ? '0' + d : d);
	var { 0: year, 1: month, 2: day } = text.split("-");
    let daySuffix = (day >= 4 && day <= 20) || (day >= 24 && day <= 30)
        ? "th"
        : ["st", "nd", "rd"][day % 10 - 1];
    let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let dayPrefix="";
	let monthPrefix="";
    if(Number(day)<10){
		dayPrefix="0";
	}
	if(Number(month)<10){
		monthPrefix="0";
	}
    let dateString = dayPrefix+Number(day) + "." + monthPrefix+month + "." + year.slice(-2);
    
    let headers = getHeaders();
    let chatSessionId = getSessionCookie()
    let messageSend={
        //message:payload.text,
        text:payload.text,
		author: '',
		date: dateString,
		type:payload.type,
		metadata: {
			headers: headers,
            chat_session_id:chatSessionId,
		}
    }
    messageSend.metadata = {...payload.data, ...messageSend.metadata};
    messageSend.from = getSessionCookie();
    
    return messageSend;
}


export {buildMessage, getHeaders, setCookie ,getCookie, setCookieWithValue,deleteCookie, getSessionCookie}
