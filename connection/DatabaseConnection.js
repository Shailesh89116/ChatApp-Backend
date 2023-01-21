const mongoose= require('mongoose');
mongoose.set("strictQuery", false);
const connection=mongoose
    .connect('mongodb+srv://Shailesh89:7977078364@cluster0.ibnfm.mongodb.net/ChatDatabase?retryWrites=true&w=majority')
    .then(console.log('Database Connected Successfully'))
    .catch((err)=>{
    console.log("Connection Error",err);
});

module.exports=connection;