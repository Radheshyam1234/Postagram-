const express= require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User= require('../models/user');
const Postmodel= require('../models/post');
const requireLogin= require('../middleware/requireLogin');



router.get('/mypost',requireLogin,  (req,res)=>{
 Postmodel.find({postedBy:req.user._id})
 
 .populate("postedBy","name email",User)
.then(result=>{
  
  res.json({myposts:result})
})
.catch(err=>{
    console.log("error")
})
})

router.get('/allposts',requireLogin,async (req,res)=>{
   
   await Postmodel.find()
    .populate("postedBy","name email profilephoto followers following",User)
    .populate("comments.postedBy","_id name profilephoto followers following",User)
    .sort('-createdAt')
    
    .then(posts=>{
        res.json({post:posts})
    })
    .catch(err=>{
        console.log("error")
    })
})

router.get('/myfollowingposts',requireLogin,async (req,res)=>{
   
    await Postmodel.find({postedBy:{$in:req.user.following}})
     .populate("postedBy","name email profilephoto",User)
     .populate("comments.postedBy","_id name profilephoto",User)
     .sort('-createdAt')
     .then(posts=>{
         res.json({post:posts})
     })
     .catch(err=>{
         console.log("error")
     })
 })

router.post('/createpost',requireLogin,(req,res)=>{

    const {title,body,pic} = req.body;
    if(!title||!body||!pic){
        return res.status(422).json({error:"Please add all the fields"})
    }

 const post= new Postmodel({
     title:title,
     body:body,
     photo:pic,
   postedBy: req.user
 })
post.save().then(result=>{
    res.json({post:result})
})
.catch(err=>{
    console.log("error in saving")
})
   //res.send("Post created succesfully")
})

router.put('/like',requireLogin,(req,res)=>{
    Postmodel.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }) 
    .populate("postedBy","name email profilephoto",User)
    .populate("comments.postedBy","_id name profilephoto",User)
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })

})

router.put('/unlike',requireLogin,(req,res)=>{
    Postmodel.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","name email profilephoto",User)
    .populate("comments.postedBy","_id name profilephoto",User)
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })

})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Postmodel.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name profilephoto",User)
    .populate("postedBy","name email profilephoto",User)
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })

})


router.delete('/deletecomment',requireLogin,(req,res)=>{
    const comment={
      postedBy:req.body.postedBy,
       text:req.body.text
    }
    Postmodel.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilephoto",User)
    .populate("postedBy","name email profilephoto",User)
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })

})

router.delete('/deletepost/:postid',requireLogin,(req,res)=>{
    Postmodel.findOne({_id:req.params.postid})
    .populate("postedBy","_id",User)
    .exec((err,post)=>{
        if(err||!post)
     {   res.status(422).json({err:err})     }
     if(post.postedBy._id.toString()===req.user._id.toString())
     {
         post.remove()
         .then(result=>{
             res.json(result)
         })
         .catch(err=>{
             console.log(err)
         })
     }
       
    })
})

router.put('/editpost',requireLogin,(req,res)=>{
    Postmodel.findOne({_id:req.body.postId})
    .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
    
})

router.put('/saveeditedpost',requireLogin,(req,res)=>{
    Postmodel.findByIdAndUpdate(req.body.postId,{
         $set:{title:req.body.title, body:req.body.body}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
    
})



module.exports=router