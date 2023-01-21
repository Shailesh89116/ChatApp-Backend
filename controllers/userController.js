const generateToken = require('../config/generateToken');
const User=require('../models/UserModel');
const bcrypt=require('bcryptjs');



const register=async(req,res)=>{
    try {
        const {name,email,password,pic}=req.body;
  
    if(!name || !email || !password){
        res.status(400).json({message:"Please Enter All the Fields"});
    }
    const existUser=await User.findOne({email});
    if(existUser){
        res.status(400).json({message:"User Already Exist"});
        return
    }

    const user=await User.create({name,email,password,pic});
    await user.save();
    if(user){
        res.status(200).json({
            id:user._id,
            name:user.name,
            email:user.email,
            pic:user.picture,
            token:generateToken(user.id)
        });
    }
    } catch (error) {
        console.log(error);
    }
}

const login=async(req,res)=>{
    
        const { email, password } = req.body;
      
        const user = await User.findOne({email});
      
        const match=await user.matchPassword(password);
        console.log(match);
        if (user && !match) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.picture,
            token: generateToken(user._id),
          });
        } else {
          res.status(401).send("Invalid Email or Password");
          throw new Error("Invalid Email or Password");
        }
      }
  


const getAllUsers=async(req,res)=>{
    
    const keyword=req.query.search ? {
        $or: [
            {name: {$regex: req.query.search}},
            {email: {$regex: req.query.search}},
        ]
    }
    :{};
  
    const users=await User.find(keyword).select("-password").find({ _id: { $ne: req.user._id } });

    res.status(200).json(users);
}




module.exports={register, login, getAllUsers}