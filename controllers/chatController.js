const Chat=require('../models/ChatModel');
const User = require('../models/UserModel');


const accessChat=async(req,res)=>{
    const {userId}=req.body;
    console.log(userId);
    if(!userId){
        console.log("userId param not send with request");
        return res.status(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ],
    }).populate('users','-password').populate("latestMessage");

    isChat=await User.populate(isChat,{
        path: 'latestMessage.sender',
        select:'name pic email'
    });

    if(isChat.length>0){
        res.send(isChat[0])
    }
    else{
        var chatData={
            chatName:req.user.name,
            isGroupChat: false,
            users: [req.user._id,userId],
        };

        try {
            const createChat= await Chat.create(chatData);

            const fullChat= await Chat.findOne({_id: createChat._id}).populate("User","-password");

            res.status(200).send(fullChat)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

const fetchChat=(req,res)=>{
    try {
        Chat.find({users: {$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(results)=>{
            results=await User.populate(results,{
                path: 'latestMessage.sender',
                select:'name pic email'
            });

            res.status(200).send(results);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

const createGroupChat=async(req,res)=>{

    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please Fill all the fields"})
    }

    var users= JSON.parse(req.body.users);
    
    if(users.length<2){
        res.status(400).send({message:"More than 2 member require to form a group"});
    }

    users.push(req.user);

    try {
        const groupChat=await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).send(fullGroupChat);
    } catch (error) {
        res.send(400);
        throw new Error(error.message);
    }
}

const renameGroup=async(req,res)=>{
    const {chatId, chatName}=req.body;

    const updatedGroupName=await Chat.findByIdAndUpdate(chatId,{
        chatName
    },
    {
        new: true
    })
    .populate('users','-password')
    .populate('groupAdmin','-password');

    if(!updatedGroupName){
        res.status(400);
        throw new Error("Chat Not Found");
    }else{
        res.json(updatedGroupName)
    }
}

const removeFromGroup=async(req,res)=>{
    const {chatId,userId}=req.body;

    const removeUser=await Chat.findByIdAndUpdate(
        chatId,{
            $pull:{users:userId}
        },
        {
            new:true
        }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password');

    if(!removeUser){
        res.status(400);
        throw new Error("No user is added");
    }else{
        res.json(removeUser)
    }
}

const addToGroup=async(req,res)=>{
    const {chatId,userId}=req.body;

    const existMember=await Chat.findById(chatId)
    const array=existMember.users.includes(userId)

    if(array){
        res.send({message:"Member already added in group"})
    }

    const addUser=await Chat.findByIdAndUpdate(
        chatId,{
            $push:{users:userId}
        },
        {
            new:true
        }
    )
    .populate('users','-password')
    .populate('groupAdmin','-password');

    if(!addUser){
        res.status(400);
        throw new Error("No one is removed");
    }else{
        res.json(addUser)
    }
}

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,removeFromGroup,addToGroup}