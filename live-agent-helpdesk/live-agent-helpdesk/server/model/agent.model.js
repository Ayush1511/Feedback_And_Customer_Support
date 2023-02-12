const pool = require("./db.js");
const { NotFoundError } = require("../helpers/utility");
const { CONSTANTS } = require('../constants');
const service = require("../service/agent.availability")

const User = function(user) {
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
    this.isAvailable = user.isAvailable;
};

User.create = (newUser) => {
    return new Promise((resolve, reject) => {
        pool.getConnection( (err, connection)=> {
            if (err) {
                return reject(`${CONSTANTS.CONNECTION_ERROR}: ${err}`);
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject(`${CONSTANTS.TRANSACTION_ERROR}: ${err}`);
                }
                return connection.execute(
                    'INSERT INTO customer_agent (name,email,password,lastSelected,createdAt) VALUES (?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)', [newUser.name,newUser.email,newUser.password], (err,result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`${CONSTANTS.EXECUTION_ERROR}: ${err}`);
                            });
                        }
                        if(result.insertId){
                            return connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return reject(`${CONSTANTS.COMMIT_ERROR}: ${err}`);
                                    });
                                }
                                connection.release();
                                resolve(result.insertId)
                            });
                            
                        }
                        return connection.rollback(() => {
                            connection.release();
                            return reject(`No insert id found`);
                        });
                                                
                    })
            });
        });
    });
};

User.updateStatus = (agentId,status) => {
    return new Promise((resolve, reject) => {
        pool.getConnection( (err, connection)=> {
            if (err) {
                return reject(`${CONSTANTS.CONNECTION_ERROR}: ${err}`);
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject(`${CONSTANTS.TRANSACTION_ERROR}: ${err}`);
                }
                return connection.execute(
                    'UPDATE customer_agent SET isAvailable = ? WHERE id = ?', [status,agentId], (err,result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`${CONSTANTS.EXECUTION_ERROR}: ${err}`);
                            });
                        }
                        if(result.affectedRows!=1){
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`No agent found`);
                            });
                        }
                        return connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return reject(`${CONSTANTS.COMMIT_ERROR}: ${err}`);
                                });
                            }
                            connection.release();
                            resolve("Updated Successfully")
                        });                        
                    })
            });
        });
    });

}


User.login = async (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection( (err, connection)=> {
            if (err) {
                return reject(`${CONSTANTS.CONNECTION_ERROR}: ${err}`);
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject(`${CONSTANTS.TRANSACTION_ERROR}: ${err}`);
                }
                return connection.execute(
                    'SELECT * FROM customer_agent WHERE email = ?', [email], (err,agents) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`${CONSTANTS.EXECUTION_ERROR}: ${err}`);
                            });
                        }
                        if (!agents.length) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(new NotFoundError("No agent found"));
                            });
                        }
                        return connection.execute(
                            'UPDATE customer_agent SET isAvailable = 1 WHERE id = ?', [agents[0].id], (err,result) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return reject(`${CONSTANTS.EXECUTION_ERROR} while updating: ${err}`);
                                    });
                                }
                                if (result.affectedRows!=1) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return reject(new NotFoundError("No agent found"));
                                    });
                                }
                                return connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            connection.release();
                                            return reject(`${CONSTANTS.COMMIT_ERROR}: ${err}`);
                                        });
                                    }
                                    connection.release();
                                    resolve(agents[0])
                                });                        
                            })                        
                    })
            });
        });
    });

};

User.getAvailableAgent = () => {
    return service.getAvailableAgent()
}

module.exports = User;