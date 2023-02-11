import { setCookieWithValue } from "../buildMessage";


function updateLoginInfo(response){
    const chatboxHeaderTitle = document.getElementsByClassName("chat-box-header-title");
    if(response?.loginInfo?.attributes?.firstName && response?.loginInfo?.attributes?.lastName){
        for(let i=0;i<chatboxHeaderTitle.length;i++){
            chatboxHeaderTitle[i].innerHTML="Hi "+response.loginInfo.attributes.firstName+" "+response.loginInfo.attributes.lastName+"!"
        }
        setCookieWithValue("chatAccessToken",response?.loginInfo?.credentials?.accessToken || "",30)
        setCookieWithValue("chatRefreshToken",response?.loginInfo?.credentials?.refreshToken ||"",30)
        setCookieWithValue("chatUserId",response?.loginInfo?.attributes?.userId || "",30)
        setCookieWithValue("chatFirstName",response?.loginInfo?.attributes?.firstName || "",30);
        setCookieWithValue("chatLastName",response?.loginInfo?.attributes?.lastName || "",30);
    }
}

export {updateLoginInfo};