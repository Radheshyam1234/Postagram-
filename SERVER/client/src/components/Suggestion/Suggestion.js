import { Avatar } from '@material-ui/core'
import React,{useEffect,useContext,useState} from 'react'
import { UserContext } from '../../App'
import {FollowUser} from "../Utility"
import { Link } from 'react-router-dom'


const Suggestion = () => {
    const{state,dispatch}=useContext(UserContext)
    const[result,setResult]=useState([])
    useEffect(()=>{
        fetch("http://localhost:8080/allusers",{
            method:"GET",
            headers:{
                "content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(data=>{
           setResult(data)
        })


    },[state])

    const Follow=async(userId)=>{
        const data=await FollowUser(userId)
        dispatch({type:"UPDATEFOLLOWERS",payload:{following:data.following,followers:data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
    }
    return (
        <div style={{maxHeight:"800px",overflow:"scroll"}} >
        <div className="container"  >
             {
                 result?.map(user=>{
                     return(
                       user._id!==state?._id && !state?.following.includes(user._id) &&
                       <ul className="list-group" >
                        <li className="list-group-item" key={user._id}>
                        <Link to={"/profile/"+user._id} style={{textDecoration:"none"}}>
                            <Avatar src={user.profilephoto}/>
                            <b style={{fontSize:"13px",color:"#34495e"}}>{user.name} </b>
                        </Link>
                            <button className="btn btn-block btn-info btn-sm"
                            onClick={()=>{Follow(user._id)}}
                            >Follow
                            </button>
                            </li>
                            </ul>
                     )
                 })
             }
            
        </div>
        </div>
    )
}

export default Suggestion
