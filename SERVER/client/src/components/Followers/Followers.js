import React,{useEffect,useState,useContext} from 'react'
import { useParams } from 'react-router'
import { UserContext } from '../../App'
import { Avatar } from '@material-ui/core'
import { Link } from 'react-router-dom'
import "./Followers.css"
import { UnFollowUser,FollowUser } from '../Utility'

const Followers = () => {
    const[result,setResult]=useState([])
    const {userId}= useParams()
  const{state,dispatch}=useContext(UserContext)
    useEffect(()=>{
        fetch(`http://localhost:8080/${userId}/followers`,{
            method:"get",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(data=>{
           setResult(data.followers)
        })
    },[])

    const follow= async(userId)=>{
        const data=await FollowUser(userId)
        dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
        
    }
    const unfollow= async(userId)=>{
        const data=await UnFollowUser(userId)
        dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
       
    }


    return (
        <div className="followers-page">
            <div className="container">
            <ul className="list-group list-group-flush">
           {
               result?.map(user=>{
                   return(

                    <li key={user._id} className= "list-group-item d-flex justify-content-between align-items-center">
                         
                        <Link to={state._id===user._id?"/myprofile":"/profile/"+user._id} style={{textDecoration:"none"}}>
                            <Avatar src={user.profilephoto}/>
                           <b style={{color:"#6D214F"}}> {user.name}</b>
                        </Link>
                        {
                            state?.following.includes(user._id) ?
                            <>
                              {
                                  user._id===state._id ? <b style={{color:"blue"}}> You</b> :
                                  <button className="btn btn-sm btn-outline-danger" onClick={()=>{unfollow(user._id)}}>  Unfollow </button>                                
                             
                              }
                             
                            </>
                            : <>
                             {
                                  user._id===state._id ? <b style={{color:"blue"}}>  You</b> :
                                  <button className="btn btn-sm btn-success" onClick={()=>{follow(user._id)}}>Follow </button>
                                                             
                              }
                             
                            
                            </>
                        }
                    
                    </li>
                   )
               })
           }
           </ul>
           </div>
        </div>
    )
}

export default Followers
