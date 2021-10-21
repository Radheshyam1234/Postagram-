import React from 'react'
import {toast} from 'react-toastify'
import './Createpost.css'
import { RiImageAddFill } from "react-icons/ri";
import { useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import { uploadImage} from "../Utility"

toast.configure()
const Createpost = () => {
       const[title,setTitle]= useState("")
       const [description, setDescription] = useState("")
       const[file,setFile]=useState("")
       const[url,seturl]=useState("")
       const history=useHistory()
       const[postCreate,setPostCreate]=useState(false)

       useEffect(()=>{
           if(url){
             
            fetch("http://localhost:8080/createpost",{
                method:"post",
                headers:{
                    "content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body:description,
                    pic:url
                    
                })
           } ).then((res)=> {return (res.json())})
           .then( (data)=>{
              if( (data.error)){        
                toast.error(data.error,{position:toast.POSITION.TOP_CENTER})
                setPostCreate(false)
              }
             else {   
                toast.success( "Post created successfully",{position:toast.POSITION.TOP_CENTER})
                setPostCreate(false)
                history.push('/')
             }
          
            })
           }
           return()=>{}
       },[url])


       const postData=async(e)=>{
         e.preventDefault();
         if(!file){
          toast.error("Please add the image",{position:toast.POSITION.TOP_CENTER})
          return
         }

         setPostCreate(true)
         
         try{
          const data=await uploadImage(file)
          seturl(data.url)
         }
         catch(err){
           toast.error("Image couldn't be identified",{position:toast.POSITION.TOP_CENTER})
         }
         
          }


    return (
        <div className="create-post">
        <div className="create-post-div">
          <p className="create-post-header"> Create Post</p>

          <input placeholder="Add title" type="text" 
          value={title}
          onChange={(e=>setTitle(e.target.value))}
          />
          <br />

          <input placeholder="Add description" type="text" 
            value={description}
            onChange={(e=>setDescription(e.target.value))}
          />
          <br />

          <form>
            <label>
              <input  className="input-file" type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}} />
              <RiImageAddFill style={{ fontSize: "30px", color: "#4b7bec",cursor:"pointer" }} />
            </label>
          </form>
          <p style={{color:"brown",fontStyle:"oblique"}}>{file.name}</p>
          <hr />
          <button disabled={postCreate} onClick={(e)=>{postData(e)}} className="create-post-btn">Create Post</button>
        </div>
      </div>
    )
}

export default Createpost


