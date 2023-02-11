const { CONFIG } = require('../config');
request = require('request');
axios = require('axios')


const sendMessage = async (body) => {
    try {
         const res = await axios.post(CONFIG.rasaWebhook, body)
         if(res.status==200)return res
         else throw res

    } catch(error) {
         throw error
    }
}
    
async function Controller(req,res){
    
    await sendMessage(req.body)
    .then((result)=>{
        res.status(200).send(result.data)
    })
    .catch(error => {
        console.log(error)
        res.status(500).send("Internal Error occured")
    })
}

module.exports = {Controller,sendMessage}