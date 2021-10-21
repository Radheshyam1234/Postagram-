const express= require('express');
const mongoose= require('mongoose');
const Postmodel= require('./post')
const {ObjectId}= mongoose.Schema.Types

const userSchema= new mongoose.Schema({

name:{
    type:String,
    required: true
    
},
email:{
    type:String,
    required: true
    
},
profilephoto:{type:String,
   default:"http://res.cloudinary.com/radheshyam11/image/upload/v1628524847/ggfox5fjnoqc5ldummob.png"
},

description:{
 type:String,
 default:"Kuchh to likh"
},

password:{
    type:String,
    required: true
    
},
followers:[ { type:ObjectId,ref:"User"}],
 
following:[{ type:ObjectId,ref:"User"}],

savedpost:[{type:ObjectId,ref:"Postmodel"}],

date : {
    type: Date,
    default:Date.now
}


})


const User= new mongoose.model("Instauser",userSchema);

module.exports  = User;