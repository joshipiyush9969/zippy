import User from "../../models/User";
import { FETCH_A_USER, LOGIN, USER_CREATE } from "../actions/Auth";

const initialState = {
    users:[],
    currentUser:null,
    allUsers:[]
};

export default (state=initialState,action) => {
    switch(action.type){
        case USER_CREATE:
            const newUser = new User(
                action.userCredentials.id,
                action.userCredentials.name,
                action.userCredentials.realName,
                action.userCredentials.dpUrl,
                action.userCredentials.password
            );

            return{...state,
            users:state.users.concat(newUser),
            currentUser:action.userCredentials.id
            }

        case LOGIN:
            return{
                users:action.users
            }
        case FETCH_A_USER:
            return{
                currentUser:action.current,
                users:action.users,
                allUsers:action.allUsers
            }
            
        default:
            return state
    }
}