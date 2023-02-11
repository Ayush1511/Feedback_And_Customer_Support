const express = require("express");
const cors = require("cors");
const { CONTEXT_PATH } = require("./server/config");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const options = {
  path: "/jfl-chat-ui/socket",
  allowEIO3: true,
  transports: ["websocket"],
  cors: {
    origin: "*", //hoisted api origin
    methods: ["GET", "POST"],
  },
};
const cookie = require("cookie")
const ioMiddleWare = require("socket.io")(http, options);
const path = require("path");
const rasaController = require("./server/controllers/rasaController");
const redisAdapter = require("@socket.io/redis-adapter")
const redis = require("redis")


app.disable("x-powered-by");

app.use((req, res, next) => {
  // console.log(`Request recieved from ${req.url} at ${new Date()}`);
  next();
});

console.log("API END PONT --->>>", process.env.API_END_POINT);
console.log("SERVER----VERIFY_USER", process.env.VERIFY_USER);

app.use(bodyParser.urlencoded({ extended: false }));
console.log("bodyParser.urlencoded");
app.use(bodyParser.json());
console.log("bodyParser.json", bodyParser.json());
app.use(cors());

app.use(`${CONTEXT_PATH}chat`, require("./server/serverRoutes")); // no auth required routes
app.use(`${CONTEXT_PATH}health`, require("./server/serverRoutes")); // no auth required routes

app.use(`${CONTEXT_PATH}`, express.static("dist"));
app.use(`${CONTEXT_PATH}/static`, express.static("static"));
app.use(`${CONTEXT_PATH}src/assets/images`, express.static("src/assets/images"))

app.use(`${CONTEXT_PATH}`, (req, res) => {
  console.log("Default handler ---> path --->", req.originalUrl);
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

const redisUrl="redis://localhost:6379";

(async () => {
  pubClient = redis.createClient({ url: redisUrl,key: "chat-ui-socket" ,password:""});
  await pubClient.connect();
  subClient = pubClient.duplicate();
  ioMiddleWare.adapter(redisAdapter.createAdapter(pubClient, subClient));
  pubClient.on("error", (err) => {
    console.log(`PubClient: ${err.message}`);
  });
  
  subClient.on("error", (err) => {
    console.log(`SubClient: ${err.message}`);
  });

})();

ioMiddleWare.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });

  socket.on("client_joined", (id) => {
    console.log(`Joining client socket with grpId ${id}`)
    socket.join(id);
  });

  
  // listen to msg sent by client
  socket.on("user_uttered", async (message) => {
    socket.to(message.from).emit("user_broadcast",message);
    message.sender = message.metadata.chat_session_id || socket.id;
    
    await rasaController.sendMessage(message).then(res_=>{
      res_.data.map((msg)=>ioMiddleWare.to(message.from).emit("bot_uttered",msg))
      
    }).catch(error=>{
      console.log("ERROR RESPONSE IS", error)
      ioMiddleWare.to(message.from).emit("bot_uttered",{text:'Internal Error Occurred. Please try again after some time'})
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
