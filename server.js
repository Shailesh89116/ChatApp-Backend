const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const connection=require('./connection/DatabaseConnection')
const { chats } = require('./data');
const routes=require('./routes/mainRoute');
const { urlencoded } = require('body-parser');
const { notFound } = require('./middleware/NotFound');
const { errorHandler } = require('./middleware/ErrorHandler');

const app=express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(urlencoded());

const PORT=5000;


app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/',(req,res)=>{
    res.send('Api Running');
});



// app.get('/chats/:id',(req,res)=>{
//     const chat=chats.find(c=>c._id===req.params.id);
//     console.log(req.params.id);
//     res.send(chat);
// });

app.use('/',routes);

// app.use(notFound);
// app.use(errorHandler)