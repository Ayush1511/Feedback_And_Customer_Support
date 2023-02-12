const express = require("express");
const cors = require("cors");
const { CONTEXT_PATH } = require("./server/config");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const service = require("./server/service/agent.availability");
const redisAdapter = require("@socket.io/redis-adapter")
const redis = require("redis")
const producer = require("./server/service/kafka.producer").KafkaService

app.disable("x-powered-by");
const options = {
  path: "/live-agent-helpdesk/socket",
  allowEIO3: true,
  transports: ["websocket"],
  cors: {
    origin: "*", //hoisted api origin
    methods: ["GET", "POST"],
  },
};

const ioHelpDesk = require("socket.io")(http, options);
const redisUrl="redis://localhost:6379";

(async () => {
  pubClient = redis.createClient({ url: redisUrl,key: "live-agent-socket" ,password:""});
  await pubClient.connect();
  subClient = pubClient.duplicate();
  ioHelpDesk.adapter(redisAdapter.createAdapter(pubClient, subClient));
  pubClient.on("error", (err) => {
    console.log(`PubClient: ${err.message}`);
  });
  
  subClient.on("error", (err) => {
    console.log(`SubClient: ${err.message}`);
  });

})();



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(`${CONTEXT_PATH}api/`, require("./server/serverRoutes")); // no auth required routes
app.use(`${CONTEXT_PATH}health/`, require("./server/serverRoutes")); // no auth required routes

app.use(`${CONTEXT_PATH}`, express.static("dist"));
app.use(`${CONTEXT_PATH}/static`, express.static("static"));

app.use(`${CONTEXT_PATH}`, (req, res) => {
  console.log("Default handler ---> path --->", req.originalUrl);
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

service.setIO(ioHelpDesk)

ioHelpDesk.on("connection", (socket) => {

  socket.on("client_joined",(groupId)=>{
    console.log(`Joining client socket with grpId ${groupId}`)
    socket.join(groupId)
  });


  socket.on("agent_joined_helpdesk",(joinId)=>{
    console.log(`agent_joined_helpdesk ${joinId}`);
    socket.join(joinId.toString());
  })

 
  socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });

  
  // listen to msg sent by client
  socket.on("user_uttered_to_live_agent",  (messageObj) => {
    socket.to(messageObj.from).emit("user_broadcast",messageObj);
    console.log(`sending msg to live agent ${messageObj.sendTo} from user ${messageObj.from} : ${messageObj.content.text}` )
    messageObj.content.sender = socket.id;
    socket.to(messageObj.sendTo).emit("user_uttered_to_live_agent",messageObj.content)
    producer.sendRecord({
        sessionId: messageObj.from,
        userId: messageObj.userid,
        agentId: messageObj.sendTo,
        from: "user",
        text: messageObj.content.text
    })
  });
  socket.on("live_agent_uttered_to_user", messageObj => {
    console.log(`sending msg to user ${messageObj.sendTo} from live agent ${messageObj.from} : ${messageObj.text}` )
    messageObj.sender = socket.id;
    ioHelpDesk.to(messageObj.sendTo).emit("live_agent_uttered_to_user",messageObj)
    if(!messageObj.liveAgentTerminate){
      socket.to(messageObj.from).emit("live_agent_uttered_to_user_broadcast",messageObj)
    }
    producer.sendRecord({
          sessionId: messageObj.sendTo,
          agentId: messageObj.from,
          from: "agent",
          text: messageObj.text
    })
  });

  socket.on("connect_user_and_live_agent",(messageObj)=>{
    console.log("connect_user_and_live_agent",messageObj)
    socket.to(messageObj.sendTo).emit("connect_user_and_live_agent",messageObj)
  });

  socket.on("connection_ended",(messageObj)=>{
    console.log("connection between user and agent has ended",messageObj);
    ioHelpDesk.to(messageObj.sendTo).emit("connection_ended",{text:"conversation with user ended"});
  })

  socket.on("isAvailable", (arg, callback) => {
    socket.to(arg).timeout(15000).emit("isAvailable", arg, (err, response) => {
      if (err) {
        console.log("Request Timeout for agent: " + arg)
      } else {
        callback(response);
      }
    });
  });
});


http.listen(process.env.PORT || 5000, () => {
  console.log(`App Started on PORT ${process.env.PORT || 5000}`);
});


//Global uncaughtException, unhandledRejection handling after app start
process.on("uncaughtException", function (err) {
  console.log(err);
});
process.on("unhandledRejection", function (err) {
  console.log(err);
});

module.exports = {ioHelpDesk}