const jwt=require('jsonwebtoken');

const generateToken=(id)=>{
    return jwt.sign({id},'shailesh',{
        expiresIn:"30d",
    });
}


module.exports=generateToken;