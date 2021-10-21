import React,{ useEffect,useState } from 'react'
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { KeyboardBackspaceSharp } from "@material-ui/icons";
import { useContext } from 'react'
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { UserContext} from '../../App'
import { getUserData } from '../Utility';
import './EditProfile.css'
toast.configure()

const EditProfile = () => {
    const {state,dispatch} =useContext(UserContext)
    const[result,setResult]=useState()
    const[name,setname]=useState()
    const[bio,setBio]=useState()
    const [image, setimage] = useState("");
    const[url,seturl]=useState("")
    const[imageModelOpen,setImageModelOpen]=useState(false)
    const[ModelImage,setModelImage]=useState()

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };


 useEffect( async()=>{

      const data= await getUserData()  
      setResult(data)
      setname( data.name)
      setBio( data.description)
      setimage( data.profilephoto)

        return ()=>{    }
           },[state])
          
  useEffect(()=>{
            if(url){
              fetch("http://localhost:8080/saveeditedprofilepicture",{
                  method:"put",
                  headers:{
                      "content-Type":"application/json",
                      "Authorization":"Bearer "+localStorage.getItem("jwt")
                  },
                  body:JSON.stringify({
                
                    profilephoto:url
                  })
            } ).then((res)=> {return (res.json())})
            .then( (data)=>{
            
                if( (data.error)){        
                  toast.error(data.error,{position:toast.POSITION.TOP_CENTER})
                      
                }
              else { 
                
                  dispatch({type:"UpdatedProfilePic",payload:{profilephoto:data.profilephoto}})
                  toast.success("Profile picture saved",{position:toast.POSITION.TOP_CENTER})
                  localStorage.setItem("user",JSON.stringify( data))
              }
            
              })
            }

            return()=>{}
            },[url])

const  SaveEditPicture=(image)=>{

    const data= new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","radheshyam11")

    fetch("https://api.cloudinary.com/v1_1/radheshyam11/image/upload",{
        method:"post",
        body:data
    }).then(res=>res.json())
    .then(data=>{

        seturl(data.url)
    }).catch(err=>{
        toast.error("Something went wrong",{position:toast.POSITION.TOP_CENTER})
    })

}
    
 const SaveProfile=()=>{
    
    fetch("http://localhost:8080/saveeditedprofile",{
        method:"put",
        headers:{
            "content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
       
           name:name,
           description:bio
         })
   } ).then((res)=> {return (res.json())})
   .then( (data)=>{
      if( (data.error)){        
        toast.error(data.error,{position:toast.POSITION.TOP_CENTER})
             
      }
     else { 
        dispatch({type:"UpdatedProfile",payload:{name:data.name,bio:data.description}})
        toast.success("Saved Successfully",{position:toast.POSITION.TOP_CENTER})
        localStorage.setItem("user",JSON.stringify( data))
     }
  
    })

 }   
 
 const removeProfilePic=()=>{
  fetch("http://localhost:8080/removeprofilepic",{
    method:"delete",
    headers:{
        "content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
} ).then(res=>res.json())
.then(data=>{
  dispatch({type:"UpdatedProfilePic",payload:{pic:data.profilephoto}})
        toast.success("Saved Successfully",{position:toast.POSITION.TOP_CENTER})
        localStorage.setItem("user",JSON.stringify( data))
})
 }
      

    return (
        <div className="edit-profile">

            <Modal open={imageModelOpen}  onClose={()=>{setImageModelOpen(false)}}  center >
              <img  style={{width:"100%",height:"500px"}}
              src={ModelImage} alt="loading"/>  <br/> 
            </Modal>

           {result   ?
        
        <div className="update-field">
        <div
          style={{
            fontWeight: "bold",
            color: "#00b894",
            fontSize: "20px",
            letterSpacing: "0.3px"
          }}
        >
          Edit Profile Information
        </div>
        <Avatar
          src={image}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{cursor:"pointer",height:"140px",width:"140px",margin:"15px"}}
        />
        <p
          onClick={handleClick}
          style={{ color: "#0984e3", cursor: "pointer", letterSpacing: "1px" }}
        >
          Edit profile photo
        </p>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <form>
            <label>
              <input
                className="profile-image-input"
                type="file"
                onChange={(e)=>{SaveEditPicture(e.target.files[0])}}
              />
              <MenuItem onClick={handleClose}>
                <span style={{ color: "blue" }}>
                  <b>Change Photo</b>
                </span>
              </MenuItem>
            </label>
          </form>
          <hr />
          <MenuItem
            onClick={() => {
              setModelImage(result.profilephoto);setImageModelOpen(true)
              handleClose();
            }}
          >
            <span style={{ color: "#2c3e50" }}>
              <b>View Photo </b>
            </span>
          </MenuItem>
          <hr />
          <MenuItem
            onClick={() => {
              removeProfilePic()
              handleClose();
            }}
          >
            <span style={{ color: "red" }}>
              <b> Remove Photo</b>
            </span>
          </MenuItem>
        </Menu>

        <input 
        type="text"
         placeholder="Add name"
         value={name}    
         onChange={(e=>setname(e.target.value))}
         >

        </input>


        <input 
        type="text"
         placeholder="Add bio"
         value={bio}    
            onChange={(e=>setBio(e.target.value))}
         >         
         </input>

        <button type="button" className="save-info-btn"
        onClick={(e)=>{ e.preventDefault(); SaveProfile() }}
        >
          Save information
        </button>
        <div className="go-back-arrow">
        <Link to ='/myprofile' ><KeyboardBackspaceSharp /></Link>
        </div>
      </div>

            : <div className="spinner-border text-danger"></div>
        // :<h2>Loading</h2>
    }
       
        </div>
    )
}


export default EditProfile




