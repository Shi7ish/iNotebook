var jwt = require('jsonwebtoken')
const JWT_SECRET = 'shirishsucksmydick'

const fetchuser = (req, res, next) => {
    //get the user form the jwt token add the id to the req object 
    const token = req.header("auth-token")
    if(!token){
        res.status(401).send({error : 'Please Authenticate using a token'})
    }
    try {
        const data  = jwt.verify(token, JWT_SECRET);
        req.user = data.user;

        next();
    } catch (error) {
        res.status(401).send({error : 'Please Authenticate using a token'}) 
    }
}

module.exports = fetchuser