const Message=require('../models/MessageModel')
const User=require('../models/UserModel')
const Chat=require('../models/ChatModel')

const sendMessage=async(req,res)=>{

    const {chatId, content }=req.body;

    if(!content || !chatId){
        console.log("Invalid Data Passed into request");
        return res.status(400)
    }

    var newMessage={
        sender: req.user._id,
        content : content,
        chat : chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate('sender','name picture');
        message = await message.populate('chat');
        message = await User.populate(message,{
            path: "chat.users",
            select: "name picture email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message
        });
        res.json(message)
    } catch (error) {
        res.send(error);
    }

}


const allMessage=async(req,res)=>{
    try {
        const messages=await Message.find({chat : req.params.chatId}).populate("sender","name email picture").populate('chat');

        res.json(messages)
    } catch (error) {
        res.status(400).send(error)
    }
}


module.exports= {sendMessage, allMessage}