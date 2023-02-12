const config = {
    local: {
      endPoint: '',
      DOMAIN: '',
      TOKEN_SECRET: 'Dominos',
      KAFKA: 'kafka-ind-dev2.dominosindia.in:9092'
    },
    development: {
      endPoint: '',
      DOMAIN: '',
      TOKEN_SECRET: 'Dominos',
      KAFKA: 'kafka-ind-dev2.dominosindia.in:9092'
    },
    stage6: {
      endPoint: '',
      DOMAIN: '',
      TOKEN_SECRET: 'Dominos'
    },
    uat: {
      endPoint: '',
      DOMAIN: '',
      TOKEN_SECRET: 'Dominos'
    },
    production: {
      endPoint: '',
      DOMAIN: '',
      TOKEN_SECRET: 'Dominos'
    },
  };
  
  module.exports = {
    CONFIG: {...config[process.env.API_END_POINT || 'local'] },
    CONTEXT_PATH: '/live-agent-helpdesk/',
  };
  