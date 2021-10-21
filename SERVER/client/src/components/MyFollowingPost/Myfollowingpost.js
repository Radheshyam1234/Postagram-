import React from 'react'
import {toast} from 'react-toastify'
import { useEffect,useContext } from 'react'
import { useState } from 'react'
import Post from "../Post/Post"
import '../Home/Home.css'
toast.configure()


const Myfollowingpost = () => {
    const [result,setResult]=useState([])
   
   useEffect(()=>{
    fetch("http://localhost:8080/myfollowingposts",{
        method:"get",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
   } ).then(res=>res.json())
   .then(data=>{
     setResult(data.post)
    
   }).catch(err=>{console.log("Error")})

   return()=>{}

   },[result])

   return ( <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
    { result ?

        <>
    
    {result.map(item=>{
      return( <>
       <Post post={item}/>
        </>
      )
})
    }

</>
    : <h2> Loading the content....</h2>
    
    }
      
      </div> 
    )
}

export default Myfollowingpost



