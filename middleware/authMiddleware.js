const jwt=require('jsonwebtoken');
const User=require('../models/UserModel');

module.exports.protect=async(req,res,next)=>{
    let token;
    
    if(
        req.headers.authorization 
    ){
        try {
            token=req.headers.authorization.split(" ")[1];

            //decode token id
            const decode=jwt.verify(token,'shailesh');

            req.user= await User.findById(decode.id).select('-password');
            
            next();
        } catch (error) {
            console.log(error);
           res.send({message:"Not Authorized, no token"});
        }
    }

    if(!token){
        res.send({message:"no token"});
    }
}