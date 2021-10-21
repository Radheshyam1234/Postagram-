const express= require('express');
const app = express();
const { MONGOURI}= require('./config/keys')
const PORT = process.env.PORT||8080
const mongoose=require('mongoose');
const cors=require('cors');

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false})
.then(()=>{
console.log(`connected to database`)
}).catch((err)=>{
    console.log(err);
})

require("./models/user");
require("./models/post");
 app.use(cors())
const routes=require('./routes/auth')
app.use('/',routes)
const routes2= require('./routes/post')
app.use('/',routes2)
const routes3=require('./routes/user')
app.use('/',routes3)

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("/*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log(`listening to port number 8080`);
})