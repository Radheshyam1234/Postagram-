import React, { useContext, useEffect,useState} from 'react'
import {toast} from 'react-toastify'
import './Profile.css'
import { UserContext} from '../../App'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import{BiEdit} from "react-icons/bi"
import {AiTwotoneDelete} from "react-icons/ai"
import { Link, NavLink } from 'react-router-dom'
import { DeletePost } from '../Utility';
toast.configure()

const Profile = () => {
    const [result, setResult] = useState([])
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const[imageModel,setImageModel]=useState()
   const {state,updatePosts,setUpdatePosts} =useContext(UserContext);

    useEffect(()=>{
       const loadData=()=>{
        fetch("http://localhost:8080/mypost",{
            method:"get",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
       } ).then(res=>res.json())
       .then(data=>{
       
           setResult(data.myposts)
         
       }).catch(err=>{console.log("Error")})
       } 
    loadData()
   return ()=>{setResult()}

   },[state,updatePosts])
     
   const deletepost=async(postid)=>{
    try{
   const data= await DeletePost(postid)
   setUpdatePosts(prev=>!prev)    
       toast.info( "Post deleted successfully",{position:toast.POSITION.TOP_CENTER})
       setImageModelOpen(false)
    }
    catch(err){
       toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
       setImageModelOpen(false)
    }
   }


    return (<>

<Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >

        <p style={{display:"flex",justifyContent:"space-evenly",margin:"5px"}}>
          <Link to ={"/editpost/"+imageModel?._id} style={{textDecoration:"none"}}> 
            <BiEdit style={{fontSize:"28px",cursor:"pointer",color:"#0c2461"}}/>
           </Link> 
            <AiTwotoneDelete style={{fontSize:"28px",cursor:"pointer"}} onClick={()=>{ deletepost(imageModel._id)}}/>
        </p>
        
    <img  style={{width:"100%",height:"500px"}}
        src={imageModel?.photo} alt="loading"/> <br/> 
        <p style={{display:"flex",justifyContent:"space-evenly",margin:"12px"}}>
        <b style={{color:"red"}}>{imageModel?.likes.length} likes</b> 
        <b style={{color:'brown'}}>{imageModel?.comments.length} comments</b>
        </p>
 </Modal>

        {  state?
       
        <div className="profile_page">
            <div className="profile_information">
                <div>
                     <img className="profile_image" 
                     src={state.profilephoto?state.profilephoto:"https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"} 
                     alt="profile_pic"/>
                     <p style={{fontFamily:"cursive",fontWeight:"normal"}}>{state.description}</p>
                </div>
                  
                <div className="profile_info">
                     <div className="user_name">
                         <h6>{state?state.name:"loading"}</h6>
                         <h6 ><a style={{textDecoration:"none"}} href="mailto:{state.email}">{state.email}</a></h6>
                    </div>
                         <div className="post_follwer_info">
                         
                     <Link to={state._id+"/followers"} style={{textDecoration:"none"}}>
                          <h6 style={{color:"#EA2027"}}><b>{state.followers.length} Followers</b></h6>
                     </Link>

                     <Link to={state._id+"/following"} style={{textDecoration:"none"}}>
                         <h6 style={{color:"#EE5A24"}}><b>{state.following.length} Following</b></h6>
                     </Link>
                         <h6 style={{color:""}}><b>{result?.length} Posts</b></h6>
                         </div>
                
                         </div>
                         <div>
                     <Link to = '/editprofile'> <button className="btn btn-info">
                     <h6>Update Profile</h6>
                     </button></Link>
                </div>
               
            </div>
            <hr/>
            <h2 style={{textAlign:"center"}}>Uploaded Images</h2><br/>
          <div className="gallery">

           { result?.map(item=>{
               return(
               <img key={item._id} src={item.photo} alt="images"
               onClick={()=>{setImageModel(item);setImageModelOpen(true)}}
               />
               )

            })
           }
              
          </div> <hr/>
         <p style={{textAlign:"center"}}> 
         <Link to = {"/savedposts/"+state._id}> <button className="btn btn-info">
                     <h6>See saved posts</h6>
                     </button></Link></p>
        
        </div>
        :<h2>loading</h2>
       
     } 
     </>)
}

export default Profile

