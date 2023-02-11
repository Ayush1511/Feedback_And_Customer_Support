const kafka = require("kafka-node");
const CONFIG = require("../config/index").CONFIG

const client = new kafka.KafkaClient({kafkaHost: CONFIG.KAFKA});

const producer = new kafka.Producer(client);

producer.on("ready", function() {
    console.log("Kafka Producer is connected and ready.");
});
producer.on("error", function(error) {
  console.log(`Kafka Producer: ${error}`);
});

const KafkaService = {
    sendRecord: (chat) => {   

        const event = {
            sessionId: chat.sessionId,
            timestamp: Date.now(),
            userId: chat.userId,
            agentId: chat.agentId,
            event: chat.from,
            text: chat.text
        };

        const buffer = new Buffer.from(JSON.stringify(event));

        const record = [
            {
                topic: "live-agent-user-chat",
                messages: buffer,
                attributes: 1 /* Use GZip compression for the payload */
            }
        ];

        producer.send(record, (error)=>{
            if(error){
                console.log(`Error while emitting kafka event for storing live agent chat : ${event} : ${error} `)
            }
        });
    }
};

module.exports = {KafkaService};