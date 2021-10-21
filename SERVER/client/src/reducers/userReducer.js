export const initialState=null;
export const reducer=(state,action)=>{
if(action.type==="USER")
{
    return action.payload
}
if(action.type==="LOGOUT")
{
    return null
}

if(action.type==="UpdatedProfile")
{
    return {
        ...state,
        name:action.payload.name,
        description:action.payload.bio
      
    }
}

if(action.type==="UpdatedProfilePic")
{
    return {
        ...state,
       
        profilephoto:action.payload.pic
    }
}



if(action.type==="UPDATEFOLLOWERS"){
    return{
        ...state,
        followers:action.payload.followers,
        following:action.payload.following
    }
}

if(action.type==="UPDATESAVEDPOST"){
    return{
        ...state,
       savedpost:action.payload.savedpost
    }
}

return state
}