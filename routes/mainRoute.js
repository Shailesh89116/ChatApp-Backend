const Router=require('express');
const userRoute=require('../routes/userRoutes');
const chatRoute=require('../routes/chatRoute')



const router=Router();

router.use('/api/user',userRoute);
router.use('/api/chat',chatRoute)


module.exports=router;