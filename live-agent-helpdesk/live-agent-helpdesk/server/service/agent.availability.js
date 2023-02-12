
const pool = require("../model/db");
const { CONSTANTS } = require('../constants');

var ioHelpDesk = {};

function setIO(arg){
    ioHelpDesk = arg
}

const checkForAgent = (triedIds) => {
    return new Promise((resolve, reject) => {
        pool.getConnection( (err, connection)=> {
            if (err) {
                return reject(`${CONSTANTS.CONNECTION_ERROR} while checking for available agent: ${err}`);
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject(`${CONSTANTS.TRANSACTION_ERROR} while checking for available agent: ${err}`);
                }
                let list = triedIds.map(function (a) { return "'" + a + "'"; }).join(",");
                let sql_query = `SELECT * FROM customer_agent WHERE isAvailable=1 AND id NOT IN (${list}) ORDER BY lastSelected LIMIT 1 FOR UPDATE`;
                return connection.execute(
                    sql_query, (err,result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`${CONSTANTS.EXECUTION_ERROR} while checking for available agent: ${err}`)
                            });
                        }
                        if(!result.length){
                            return connection.rollback(() => {
                                connection.release();
                                return resolve({});
                            });
                        } 
                        console.log("sql result"+ result[0].name);
                        triedIds.push(result[0].id)
                        return checkWithAgentIfAvailable(result[0].id,() => {
                            return connection.execute(
                                'UPDATE customer_agent SET isAvailable = (?),lastSelected = CURRENT_TIMESTAMP WHERE id = (?);', [0,result[0].id], (err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            return reject(`${CONSTANTS.EXECUTION_ERROR} while updating agent status with id ${result[0].id} while checking availability`);
                                        });
                                    }
                                    return connection.commit((err) => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                return reject(`${CONSTANTS.COMMIT_ERROR} while checking agent availability for agentId: ${result[0].id}: ${err} `);
                                            });
                                        }
                                        connection.release();
                                        resolve(result[0])
                                    });
                                })
                        }, (errorResponse) => {
                            return connection.rollback(() => {
                                    connection.release();
                                    return reject(errorResponse);
                                });
                        });
                    });
            });
        });
    });
}

async function getAvailableAgent(){
    triedIds = [-1]
    // It should try for available agent. Keeping large number.
    var tries = 50;
    while(tries-->0){
        try {
            agent = await checkForAgent(triedIds);
            return agent;
            
        } catch(error) {
            console.log(error);
        }
    }
   return {}
}

async function checkWithAgentIfAvailable(id, successCallback, errorCallback) {
    const sockets = await ioHelpDesk.in(id.toString()).fetchSockets();

    if(!sockets.length){
        errorCallback(`No agents in room: ${id}`);
        return
    }
    var ack = false;

    for (const socket of sockets) {
        socket.timeout(15000).emit("isAvailable", id, (err,response)=> {
            if(ack==true){
                console.log(`Already acknowledged/timout at other socket for room id ${id}`)
                return
            };
            ack = true;
            if (err) {
                errorCallback(`${err}: agentId: ${id}`);
            } else {
                if(response.connect == true){
                    successCallback();
                }
                else{
                    errorCallback(`Agent with id ${id} denied`);
                }
            }
            });
        }
        
      }

module.exports = {getAvailableAgent,setIO}