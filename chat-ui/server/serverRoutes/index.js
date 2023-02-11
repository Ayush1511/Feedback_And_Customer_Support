const express = require('express');
const router = require('express').Router();
const { errorMessages } = require('../constants/constant');
const { CONTEXT_PATH } = require('../config');
const app = express();
var rasaController = require('../controllers/rasaController.js')


const http = require('http').createServer(app);
const options = { 
    path: `${CONTEXT_PATH}`,
    allowEIO3: true,
    cors: {
      origin: "", // Hoisted api origin
      methods: ["GET", "POST"]
    }
};
const io = require('socket.io')(http, options);

router
    .route("/sendMessage")
    .post(rasaController.Controller)


// healthcheck route
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
