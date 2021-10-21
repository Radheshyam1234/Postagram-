import React,{ useEffect,useState } from 'react'
import { useParams,  useHistory } from 'react-router'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom'
import { KeyboardBackspaceSharp } from "@material-ui/icons";
import './EditPost.css'
toast.configure()

const EditPost = () => {
    const {postid} =useParams();
    const history=useHistory()
    const[result,setResult]=useState()
    const[postSaved,setPostSaved]=useState(false)
    
     const[title,setTitle]=useState()
     const[body,setBody]=useState()

     const loadData=async()=>{
        fetch(`http://localhost:8080/editpost`,{
            method:"put",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
             postId:postid
           })
        })
        .then(res=>res.json())
        .then( async data=>{
         setResult(await data)
          setTitle(await data.title)
          setBody(await data.body)
          
        })

        
     }

    useEffect( ()=>{
        loadData()
        return ()=>{
         setResult([])
        }
        },[])

const EditPost= async ()=>{
    if(!title||!body){
        toast.error( "Please add all the fields",{position:toast.POSITION.TOP_CENTER})
        return;
    }
    
  try{
      setPostSaved(true)
      const res= await fetch(`http://localhost:8080/saveeditedpost`,{
        method:"put",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
         postId:postid,
         title:title,
         body:body
       })
    })
    const data= res.json();
    toast.success( "Post saved successfully",{position:toast.POSITION.TOP_CENTER})
    setPostSaved(false)
  } 
    catch(err){
        toast.error( "Some issues occured",{position:toast.POSITION.TOP_CENTER})
        setPostSaved(false)
    }

    
}
    return (
       
        <div className="edit-post" style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection: "column"}}>
             {
            result? <>
            <div className="edit-post-div">
            <p className="edit-post-header"> Edit Post</p>
            <input 
                placeholder="Add title"
                type="text"
                value={title}    
                onChange={(e=>setTitle(e.target.value))} 
             />
            <br />
            <input
                placeholder="Add description"
                type="text"
                value={body}    
                onChange={(e=>setBody(e.target.value))} 
               />
            <button disabled={postSaved} className="btn" onClick ={()=>{ EditPost()}} >Update Post</button>
      </div>
      <div className="go-back-arrow">
        <Link to ='/myprofile' ><KeyboardBackspaceSharp /></Link>
        </div>
        </>
        :  <div className="spinner-border text-danger"></div>
        }
        

        </div>
    )
}

export default EditPost

