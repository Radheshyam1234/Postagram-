import React,{useState,useEffect,useContext} from 'react'
import { useParams } from 'react-router'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {MdDelete} from "react-icons/md"
import { RemoveBookMark } from '../Utility';
import {toast} from 'react-toastify'
import { UserContext } from '../../App';
import "./SavedPosts.css"
toast.configure()

 const SavedPosts = () => {
  const[savedPosts,setSavedPosts]= useState([])
  const[imageModelOpen,setImageModelOpen]=useState(false)
  const[ModelImage,setModelImage]=useState()
  const{state,dispatch}=useContext(UserContext)

const{userId}=useParams()

  useEffect(()=>{

    const fetchPost=async ()=>{
      fetch(`http://localhost:8080/mysavedposts/${userId}`,{
          method:"get",
          headers:{
              "content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          }
  
      }).then(res=>res.json())
        .then(async result=>{
          
            setSavedPosts(await result.savedpost)
           
        })
        .catch(err=>{
            console.log(err)
        })
  }

    fetchPost()

  return ()=>{}
  },[state])

  const RemoveSavedPost =async (post)=>{
    try{
      const data=await RemoveBookMark(post._id)
      dispatch({type:"UPDATESAVEDPOST",payload:{savedpost:data.savedpost}})
      // localStorage.setItem("user",JSON.stringify( data))
      toast.info("Removed Successfully",{position:toast.POSITION.TOP_CENTER})
    }
   catch(err){
    toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
   }
    
  }

    return (
        <div className="saved-posts">
          <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
              <img  style={{width:"100%",height:"500px"}}

              src={ModelImage?.photo} alt="loading"/>  <br/> 
              <p style={{display:"flex",justifyContent:"space-evenly",margin:"15px"}}>
                <b style={{color:"red"}}>{ModelImage?.likes.length} likes</b> 
                <b style={{color:'brown'}}>{ModelImage?.comments.length} comments</b>
              </p>

            </Modal>
           {
            savedPosts.length ?
            <div className="gallery">
          
          { savedPosts.map(item=>{
              return( <div style={{
                display:"flex",flexDirection:"column",alignItems:"center",border:"2px solid green",margin:"8px"
                }}>
              <img src={item.photo} alt="images" onClick={()=>{setModelImage(item);setImageModelOpen(true)}} />
              <MdDelete style={{
                fontSize:"30px",
                cursor:"pointer"
              }}
              title="Remove from savedpost"
              onClick={()=>{RemoveSavedPost(item)}}
              />
              </div>
              )
              
           })
          }
         
             
         </div> 
        : <div  className="spinner-border text-primary"></div>
        }
           
        </div>
    )
}

export default SavedPosts