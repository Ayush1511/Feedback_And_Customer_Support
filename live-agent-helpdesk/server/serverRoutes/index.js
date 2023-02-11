const router = require('express').Router();
var agent = require('../controller/agent.controller')

router.route('/agent/login').post(agent.login)
router.route('/agent/register').post(agent.register)
router.route('/getAvailableAgent').get(agent.getAvailableAgent)
router.route('/updateStatusToActive').get(agent.updateStatusToActive)
router.route('/logout').get(agent.logout)



router.get('/', async (_req, res, _next) => {
  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
  };
  try {
      res.send(healthcheck);
  } catch (error) {
      healthcheck.message = error;
      res.status(503).send();
  }
});


module.exports = router;
