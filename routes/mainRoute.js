const Router=require('express');
const userRoute=require('../routes/userRoutes');
const chatRoute=require('../routes/chatRoute')
const messageRoute=require('../routes/messageRoute')


const router=Router();

router.use('/api/user',userRoute);
router.use('/api/chat',chatRoute)
router.use('/api/message',messageRoute)

module.exports=router;