const config = {
  local: {
    DOMAIN: 'http://localhost:5000',
    LIVE_AGENT_DOMAIN: 'http://localhost:3000',
  },
  development: {
    DOMAIN: 'http://nextgen-dev-internal.dominosindia.in',
    LIVE_AGENT_DOMAIN: 'http://internal-dev4-int-alb-2036348797.ap-south-1.elb.amazonaws.com',
  }
};
console.log('env->API END POINT->', process.env.API_END_POINT);
export default config[process.env.API_END_POINT || 'local'];
