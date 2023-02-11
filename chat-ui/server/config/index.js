const config = {
  local: {
    rasaWebhook: 'http://localhost:5005/webhooks/chat-api/webhook/'
  },
  development: { 
    rasaWebhook: 'http://rasa-srv-ind-dev2.dominos.local/webhooks/chat-api/webhook/'
  }
  
};

module.exports = {
  CONFIG: { ...config[process.env.API_END_POINT || 'local'] },
  CONTEXT_PATH: '/jfl-chat-ui/',
};
