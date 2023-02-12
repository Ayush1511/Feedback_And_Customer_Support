const User = require("../model/agent.model.js");
const config = require("../config/index").CONFIG;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {NotFoundError} = require("../helpers/utility");
const { CONSTANTS } = require('../constants');


exports.register = async (req, res) => {
    if(!req.body.password || !req.body.email || !req.body.name){
        return res.status(400).send({message:"Missing email/password/name"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        name: req.body.name,
        password: hasPassword
    });
    try {
        const id = await User.create(user);
        user.id = id;
        delete user.password;
        res.send(user);
    }
    catch (error){
        console.error(`Error while creating user: ${req.body.email}: ${error}`)
        res.status(500).send({message:error})
    }    
};


exports.login = async (req, res) => {
    try {
        if(!req.body.password || !req.body.email){
            return res.status(400).send({message:"Missing email/password"});
        }
        const user = await User.login(req.body.email);
        if (user) {
            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) return res.status(401).send({message:"Invalid password"});

            const token = jwt.sign({id: user.id}, config.TOKEN_SECRET);
            delete user.password
            const data = {
                agent:user,
                token:token
            }
            res.header("auth-token", token).send(data);
        }
    }
    catch (err) {
        if( err instanceof NotFoundError ) {
            res.status(401).send({message:`No user with email provided`});
        }
        else {
            console.log(`Error while logging ${req.body.email} : ${err}`)
            res.status(500).send({message:err});
        }
    }   
    
};

exports.updateStatusToActive = async (req,res) => {
    try {
        if(req.query.agent_id){
            var result = await User.updateStatus(req.query.agent_id,1);
            res.status(200).send({message:result})
        } else {
            res.status(500).send({message:'agent_id missing'})
        }
        
    } catch(error) {
        console.error(`Status Update failed for agentId: ${req.params.agent_id}: ${error}`)
        res.status(500).send({message:error})
    }
}

exports.logout = async (req,res) => {
    try {
        if(req.query.agent_id){
            var result = await User.updateStatus(req.query.agent_id,0);
            res.status(200).send({message:result})
        } else {
            res.status(500).send({message:'agent_id missing'})
        }
        
    } catch(error) {
        console.error(`Logout failed for agentId: ${req.params.agent_id}: ${error}`)
        res.status(500).send({message:error})
    }
}

exports.getAvailableAgent = async(req,res) => {
    try {
        var result = await User.getAvailableAgent();
        if(!Object.keys(result).length){
            return res.status(200).send({message:CONSTANTS.NO_AGENT_AVAILABLE})
        }
        delete result.password
        res.status(200).send({
            message:CONSTANTS.SUCCESSFUL,
            data: result
        })
    } catch(error) {
        console.error(`Fetching available agent failed: ${error}`)
        res.status(500).send({message:error})
    }
}