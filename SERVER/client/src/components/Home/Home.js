import React,{useEffect,useContext} from 'react'
import {toast} from 'react-toastify'
import { useState } from 'react'
import { UserContext } from '../../App'
import Suggestion from '../Suggestion/Suggestion'
import Post from "../Post/Post"

import './Home.css'
toast.configure()


const Home = () => {
    const [result,setResult]=useState([])
    const{updatePosts}= useContext(UserContext);
    
    useEffect(()=>{
        fetch("http://localhost:8080/allposts",{
            method:"get",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
       } ).then(res=>res.json())
       .then(data=>{
         setResult(data.post)
       
       }).catch(err=>{console.log("Error")})
        return()=>{setResult([])}
       },[updatePosts])
    
   
    return ( <div className="home">

<div className="suggestion-box">
       <Suggestion/>
      </div>

      <div className="all-posts">
    { result ?
  
    result.map(item=>{
      return( <div key={item._id}>
       <Post post={item}/>
        </div>
      )


})

    : <div className="spinner-border text-danger"></div>
    
    }
      </div>
      
      </div>
    )
}

export default Home

