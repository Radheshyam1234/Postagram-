import React,{useState, useContext, useEffect}from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';


 const UserrProfile = () => {

     const [userProfile,setProfile] =useState(null)
     const {state,dispatch}=useContext(UserContext)
     const[imageModelOpen,setImageModelOpen]=useState(false)
     const[imageModelSrc,setImageModelSrc]=useState(false)
    const {userid}= useParams()
    
      useEffect(()=>{
          fetch(`http://localhost:8080/user/${userid}`,{
            method:"get",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then( data=>{
           setProfile(data)
          // console.log(data)
          
        })
          },[])
     
const followUser=()=>{
  fetch("http://localhost:8080/follow",{
    method:"put",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
     followId:userid
  })
  }).then(res=>res.json())
    .then(data=>{
      dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
     setProfile((prevState)=>{
      return{
        ...prevState,
        user:{
          ...prevState.user,
          followers:[...prevState.user.followers,data._id]
        }
      }
     })



    })
}

const unfollowUser=()=>{
  fetch("http://localhost:8080/unfollow",{
    method:"put",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
     unfollowId:userid
  })
  }).then(res=>res.json())
    .then(data=>{
     
      dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
      // localStorage.setItem("user",JSON.stringify(data))
     setProfile((prevState)=>{
       const newFollower  = prevState.user.followers.filter((item)=>{return (item!==data._id)})
      return{
        ...prevState,
        user:{
          ...prevState.user,
          followers:newFollower
        }
      }
     })



    })
}

    return  (
     <div className="profile_page">

       <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
            <img  style={{width:"100%",height:"500px"}}
            src={imageModelSrc} alt="loading"/><br/>
      </Modal>
      
      {userProfile?
           <>
       
            <div className="profile_information">
                <div>
                     <img className="profile_image"
                      src={userProfile.user.profilephoto?userProfile.user.profilephoto: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png" } alt="profile_pic"/>
                </div>
                <div className="profile_info">
                     <div className="user_name">
                         <h5>{userProfile.user.name}</h5>
                         <h6 ><a style={{textDecoration:"none"}} href="mailto:{userProfile.user.email}">{userProfile.user.email}</a></h6>
                         
                    </div>
                         <div className="post_follwer_info">
                         <h6>{userProfile.posts.length} posts</h6>

                         <Link to={userProfile.user._id+"/followers"} style={{textDecoration:"none"}}>
                         <h6  style={{color:"#9b59b6"}}>{userProfile.user.followers.length} Followers</h6>
                         </Link>

                         <Link to={userProfile.user._id+"/following"} style={{textDecoration:"none"}}>
                         <h6 style={{color:"#e74c3c"}}>{userProfile.user.following.length} Following</h6>
                         </Link>
                         {
                           userProfile.user.followers.includes(state._id)
                           ?
                          <p><button 
                         className="btn btn-danger"
                          onClick={()=>unfollowUser()}>
                         Unfollow
                         </button></p>
                         :
                         <p><button 
                         className="btn btn-success"
                          onClick={()=>followUser()}>
                         Follow
                         </button></p>
                         }                        
                         
                         </div>
                       </div>             
            </div>
            <hr/>

          <div className="gallery">
           { userProfile.posts.map(item=>{
               return(
               <img key={item._id} src={item.photo} alt="images"
               onClick={()=>{setImageModelSrc(item.photo);setImageModelOpen(true)}}/>
               )
            })
           }
              
          </div>
          </>      
        :<div  className="spinner-border text-success"></div>    
      }
      </div>
       
    )
 }

export default UserrProfile