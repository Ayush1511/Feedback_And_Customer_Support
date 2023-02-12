const config = {
    development: {
      DOMAIN: 'http://internal-dev4-int-alb-2036348797.ap-south-1.elb.amazonaws.com',
    },
    local: {
      DOMAIN: 'http://localhost:5000',
    }
  };

  module.exports = {
    CONFIG: { ...config[process.env.API_END_POINT || 'local'] },
    CONTEXT_PATH: 'live-agent-helpdesk',
  };