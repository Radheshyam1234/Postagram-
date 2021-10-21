import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert"
import FavoriteIcon  from '@material-ui/icons/Favorite'
import CancelIcon from '@material-ui/icons/Cancel'
import { BiSend } from "react-icons/bi";
import FavoriteBorderIcon  from '@material-ui/icons/FavoriteBorder'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import { Avatar,IconButton } from '@material-ui/core/'
import {toast} from 'react-toastify'
import { useContext } from 'react'
import { useState } from 'react'
import { UserContext } from '../../App'
import {LikePost,UnLikePost,AddComment,DeletePost,DeleteComment,BookMarkPost, RemoveBookMark,FollowUser,UnFollowUser} from "../Utility"
import "../Home/Home.css"
toast.configure()

const Post = ({post}) => {
    const[input,setInput]=useState("")
    const[item,setItem]=useState(null)
    const{state,dispatch,setUpdatePosts}= useContext(UserContext);
    const [anchor, setAnchor] = useState(null);


 useEffect(()=>{
  setItem(post);
  return()=>{}
 },[])

    const handleClose=()=>{
        setAnchor(null)
    }
    const handleClick=(e)=>{
        setAnchor(e.currentTarget)
    }
    
    
     const postLike=async(id)=>{
     try{
   const data= await LikePost(id)  ;
    setItem(data)
        }
        catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }
        
        }
        
     const postunlike=async(id)=>{
          try  {
       const data= await UnLikePost(id)     
       setItem(data) 
         
         }    
         catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }            
           
        }
    

      const makeComment=async (text,postId)=>{
           try{
          const data= await AddComment(text,postId)   
       setItem(data)
           }
           catch(err){
               toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
           }
        
                 
         }


    const deletepost=async(postid)=>{
         try{
        const data= await DeletePost(postid)
        setUpdatePosts(prev=>!prev)    
            toast.info( "Post deleted successfully",{position:toast.POSITION.TOP_CENTER})
         }
         catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
         }
          
    
        }
    
    
    const deleteComment=async(postId,postedBy,text)=>{
     try{
      const data=await DeleteComment(postId,postedBy,text)
      setItem(data)
     
     }
       
    catch(err){
        toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
    }
 }
    
    const savePost=async(postId)=>{
        try{
      const data= await BookMarkPost(postId)
           dispatch({type:"UPDATESAVEDPOST",payload:{savedpost:data.savedpost}})     ;
          //localStorage.setItem("user",JSON.stringify(data))
           
        }
        catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }
    }
    
    const unsavePost=async(postId)=>{
        try{

       const data= await RemoveBookMark(postId)
          
            dispatch({type:"UPDATESAVEDPOST",payload:{savedpost:data.savedpost}})
            //localStorage.setItem("user",JSON.stringify( data))
        }
        catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }
    
        }

    const followUser=async(userId)=>{
        try{
            const data=await FollowUser(userId)
            dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
             // localStorage.setItem("user",JSON.stringify(data))
              setUpdatePosts(prev=>!prev)
        }
        catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }

    }
    
    const unFollowUser=async(userId)=>{
        try{
            const data=await UnFollowUser(userId)
            dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
           // localStorage.setItem("user",JSON.stringify(data))
            setUpdatePosts(prev=>!prev)
        }
        catch(err){
            toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
        }
    }

    return ( <>
    {
        item &&
        
        <div key={item._id} className="post" >

        <div className="post_header">


            <Avatar 
             src={item.postedBy.profilephoto}                                   
            />
            <h5>
            {
                item.postedBy._id===state._id ?  
                <Link to='/myprofile' style={{textDecoration:"none",color:"#6D214F"}}>{item.postedBy.name}</Link>
                : 
                <Link to={"/profile/"+item.postedBy._id} style={{textDecoration:"none",color:"#B33771"}}><b>{item.postedBy.name}</b></Link>
             }
           
            </h5> 
                     
            <div >
              { 
               state.savedpost?.includes(item._id) ?
                <BookmarkIcon style={{cursor:"pointer"}} onClick={()=>{unsavePost(item._id)}}/>
                :<BookmarkBorderIcon style={{cursor:"pointer"}} onClick={()=>{savePost(item._id)}}/>  
              }
            
            
            </div>
              
             < MoreVertIcon style={{cursor:"pointer"}}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick} 
             />

             <Menu
                id="simple-menu"
                anchorEl={anchor}
                keepMounted
                open={Boolean(anchor)}
                onClose={handleClose}
            >
                {  ( item.postedBy._id===state._id)?
                    [
                <Link to ={"/editpost/"+item._id} style={{textDecoration:"none"}}> 
                <MenuItem  onClick={()=>{handleClose()}}><span style={{color:"blue"}}><b>Edit</b></span></MenuItem>
                </Link>,

                <MenuItem onClick={()=>{deletepost(item._id);handleClose()}}><span style={{color:"red"}}><b>Delete</b></span></MenuItem>,
                <MenuItem onClick={()=>{handleClose()}}><b>Cancel</b></MenuItem>
                    ]
                :
                <div>{
               
                    state.following.includes(item.postedBy._id)  ?
                   <MenuItem onClick={()=>{unFollowUser(item.postedBy._id);handleClose()}}><span style={{color:"red"}}><b>Unfollow</b></span></MenuItem>
                   :
                   <MenuItem onClick={()=>{followUser(item.postedBy._id);handleClose()}}><span style={{color:"green"}}><b>Follow</b></span></MenuItem>
                   
                }
              
                <MenuItem onClick={()=>{;handleClose()}}>Cancel</MenuItem>
                </div>

                }
                </Menu>
           


         </div>
            <img className="post_image" src={item.photo} alt="pic"/> 
    
                 <div className="post_bottom">
                     <p className="cardBodyLikecountDiv">
                     
                     {  item.likes.includes(state._id) ?
                     < FavoriteIcon style={{color:"red",cursor:"pointer"}} onClick={()=>{postunlike(item._id)}}/>
                     :
                     < FavoriteBorderIcon style={{cursor:"pointer"}} onClick={()=>{postLike(item._id)}}/>
                     
                     }
                    <b style={{color:"#ED4C67"}}>{item.likes.length} likes </b></p>  
                     
                     <div className="post_caption"><strong>{item.title}</strong></div>
                     <div className="post_description">{item.body}</div><hr/>
                 {
                 item.comments.map(commentRecord=>{
                     return(
                     
                     
    
                         <p key={commentRecord._id} className="single-comment">
    
                         <Avatar 
                            src={commentRecord.postedBy.profilephoto} 
                            style={{height:"16px",width:"16px"}}
                         />
                         
                          <Link to={state._id=== commentRecord.postedBy._id?"/myprofile":"/profile/"+commentRecord.postedBy._id} style={{textDecoration:"none"}}>
                            <strong style={{marginLeft:"4px",fontSize:"14px",color:"#5758BB"}} >
                                {commentRecord.postedBy.name}
                            </strong>
                         </Link>
                         
                          <span style={{marginLeft:"6px",fontSize:"13px",fontWeight:"600"}}>{commentRecord.text}</span>
                        { 
                            commentRecord.postedBy._id===state._id    ?
                            < CancelIcon onClick={()=>{
                                deleteComment(item._id,commentRecord.postedBy._id,commentRecord.text)}}
                                
                                style={{color:"brown",cursor:"pointer"}}
    
                          />
    
                        :  ""
                        }
                         </p>
                   
    
                           )
                     })
                 }
             
    
                     </div>
    
                         <div className="post_comment_box">
    
                    
    
                <input type="text" value={input} placeholder="add a comment" onChange={(e)=>{setInput(e.target.value)}}></input>
                   {
                   input ? 
                   <BiSend
                    style={{
                        fontSize: "30px",
                        fontWeight:"800",
                        color: "#3742fa",
                        cursor: "pointer"
                    }}
                    onClick={()=>{    
                      makeComment(input,item._id)     
                      setInput("")             
                    }}
                />
                :
                <BiSend 
                style={{
                    fontSize: "30px",
                    color: "rgba(4, 69, 250, 0.575)",
                   
                }}
                />
                
                }   
                 </div>   
            </div> 
    }
    
       </>
        
        
    )
}

export default Post



 