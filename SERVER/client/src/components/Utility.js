
export const getUserData=async()=>{
   const res= await fetch("http://localhost:8080/updateprofile",{
        method:"put",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        
    })
    return res.json()
}

export const uploadImage=async(image)=>{
    const data= new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","radheshyam11")
  try{
    const res= await  fetch("https://api.cloudinary.com/v1_1/radheshyam11/image/upload",{
        method:"post",
        body:data
    })
    return res.json()
  }
  catch(err){return err}
   
}

export const LikePost=async(id)=>{
    try{
        const res= await fetch("http://localhost:8080/like",{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
           body:JSON.stringify({
               postId:id
           })
       } )
       return res.json()
    }
    catch(err){
        return err
    }
   
}

export const UnLikePost=async(id)=>{
    try{
        const res= await fetch("http://localhost:8080/unlike",{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
           body:JSON.stringify({
               postId:id
           })
       } )
       return res.json()
    }
    catch(err){
        return err
    }
   
}

export const AddComment=async(text,postId)=>{
    try{
       const res=await fetch("http://localhost:8080/comment",{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
           body:JSON.stringify({
              postId,
              text
           })
        })
        return res.json()
    }
    
    catch(err){
        return err;
    }
}

export const DeletePost=async(postid)=>{
    try{
        const res= await fetch(`http://localhost:8080/deletepost/${postid}`,{
            method:"delete",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        return res.json()
    }
    catch(err){
        return err
    }
}

export const DeleteComment= async(postId,postedBy,text)=>{
    try{
        const res=await fetch(`http://localhost:8080/deletecomment`,{
            method:"delete",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                postedBy:postedBy,
                text
             })
        })
        return res.json()
    }
   catch(err){
       return err
   }
}

export const BookMarkPost=async(postId)=>{
try{
    const res= await fetch(`http://localhost:8080/favourite`,{
        method:"put",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            
         })
    })
    return res.json()
}
catch(err){
    return err
}
}

export const RemoveBookMark = async(postId)=>{
    try{
        const res= await fetch(`http://localhost:8080/removefavourite`,{
            method:"delete",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                
             })
        })
        return res.json()
    }
    catch(err){
        return err
    }
}

export const FollowUser= async(userId)=>{
    try{
       const res=await fetch("http://localhost:8080/follow",{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
             followId:userId
          })
          })
          return res.json()

    }
    catch(err){
        return err;
    }
}

export const UnFollowUser= async(userId)=>{
    try{
       const res=await fetch("http://localhost:8080/unfollow",{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userId
          })
          })
          return res.json()

    }
    catch(err){
        return err;
    }
}

