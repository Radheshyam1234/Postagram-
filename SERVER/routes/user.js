const express= require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User= require('../models/user');
const Postmodel= require('../models/post');
const requireLogin= require('../middleware/requireLogin');

router.get('/getinfo',requireLogin,(req,res)=>{

    const {_id,name,email,followers,following,savedpost,description,profilephoto}=req.user;
    res.json({user:{_id,name,email,followers,following,savedpost,description,profilephoto}})

})

router.get('/user/:id',(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Postmodel.find({postedBy:req.params.id})
        .populate("postedBy","_id name", User)
        .exec((err,posts)=>{
            if(err)
            {return res.status(422).json({error:err})}
            res.json({user,posts})

        })
    })
    .catch(err=>{
        return(res.status(422).json({error:"User not found"}))
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )  
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )  
})

router.put('/favourite',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{savedpost:req.body.postId}
    },{
        new:true
    }
    ) .exec((err,result)=>{
        if(err)
            {return res.status(422).json({error:err})}
           return res.json(result)
    })
})

router.delete('/removefavourite',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull:{savedpost:req.body.postId}
    },{
        new:true
    }
    )  .exec((err,result)=>{
        if(err)
            {return res.status(422).json({error:err})}
           return res.json(result)
    })
})

router.put('/updateprofile',requireLogin,(req,res)=>{

    User.findOne({_id:req.user._id})
    .exec((err,result)=>{
        if(err){res.status(422).json({error:err})}
        else res.json(result)
    })
})

router.put('/saveeditedprofilepicture',requireLogin,(req,res)=>{

         User.findByIdAndUpdate(req.user._id,{
            $set:{profilephoto:req.body.profilephoto}
         },{
            new:true
         } )
         .exec((err,result)=>{
            if(err){res.status(422).json({error:err})}
            else res.json(result)
        })
        


})

router.put('/saveeditedprofile',requireLogin,(req,res)=>{

    User.findByIdAndUpdate(req.user._id,{
       $set:{name:req.body.name,description:req.body.description}
    },{
       new:true
    } )
    .exec((err,result)=>{
       if(err){res.status(422).json({error:err})}
       else res.json(result)
   })
   


})

router.get('/mysavedposts/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
     .populate("savedpost","title body photo likes comments postedBy", Postmodel)
    .then(user=>{
        res.json(user)
    })
    .catch(err=>{
       return res.status(422).json({error:err})
    })
    
})

router.delete("/removeprofilepic",requireLogin,(req,res)=>{
   User.findByIdAndUpdate(req.user._id,{
       $set:{profilephoto:""}
   },{
       new:true
   }) 
   .exec((err,result)=>{
    if(err){res.status(422).json({error:err})}
    else res.json(result)
})
})

router.get("/:id/followers",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
   .populate("followers","name profilephoto followers following" ,User)
    .exec((err,user)=>{
        if(err){
            res.status(422).json({error:err})
        }
        else res.json(user)
    })
})


router.get("/:id/following",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
   .populate("following","name profilephoto followers following" ,User)
    .exec((err,user)=>{
        if(err){
            res.status(422).json({error:err})
        }
        else res.json(user)
    })
})

router.get("/allusers",(req,res)=>{
    User.find()
    .then(users=>{res.json(users)})
    .catch(err=>{res.status(422).json({error:err})})
})


module.exports=router