import React from 'react'
import { NavLink,useHistory } from 'react-router-dom'
import{AiFillHome,} from "react-icons/ai"
import {MdSubscriptions} from "react-icons/md"
import{RiLogoutCircleRLine} from "react-icons/ri"
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded"
import{MdAccountCircle} from "react-icons/md"
import './Navbar.css'

import { useContext } from 'react'
import { UserContext } from '../../App'


const Navbar = () => {
  const{state,dispatch}= useContext(UserContext)
  const history=useHistory()
  
const renderlist=()=>{
    if(state){
      return[

      <div className="nav_item"><NavLink to='/'  exact={true} activeStyle={{color:"#40407a",fontSize:"33px"}}> <AiFillHome/></NavLink></div>,
    
       <div className="nav_item"><NavLink to='/myfollowingpost' activeStyle={{color:"#40407a",fontSize:"33px"}}><MdSubscriptions /></NavLink></div> ,
        
      <div className="nav_item"><NavLink to='/createpost' activeStyle={{color:"#40407a",fontSize:"33px"}}> < AddBoxRoundedIcon style={{fontSize:"30px"}}/></NavLink></div>,

      <div className="nav_item"><NavLink to='/myprofile' activeStyle={{color:"#40407a",fontSize:"33px"}}><MdAccountCircle /></NavLink></div> ,

      <div className="nav_item">
        <RiLogoutCircleRLine style={{cursor:"pointer",color:"red",fontSize:"30px"}}
           onClick={()=>{  localStorage.clear()
            dispatch({type:"LOGOUT"})
            history.push('/signin')
            
          }}
          /> 
        </div>
        // </div>

        
      ]
    }
    else{
      return[
        <div className="nav_item" style={{fontFamily:"sans-serif"}}>
        <NavLink to ={state?'/':'/signin'}>Postagram</NavLink> </div>,
        
        <div className="nav_item">
          <NavLink to='/signin' style={{textDecoration:"none"}} activeStyle={{color:"coral"}}> Signin</NavLink></div>,

        <div className="nav_item"> 
        <NavLink to='/signup' style={{textDecoration:"none"}}  activeStyle={{color:"coral"}}>Signup </NavLink></div>
      ]
    }
}

    return (
        <div className="nav_header">
         {renderlist()} 
         </div>   
     
    )
}

export default Navbar





