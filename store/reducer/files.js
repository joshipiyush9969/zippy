
import { CLEAR, FIND_SENDER, SHARE, STORE_RECIEVER,DISCONNECT_RECIEVER, STORE_SENDER_FILES, UPLOAD_FILES, FETCH_FILES, GET_URI } from "../actions/files";

const initialState = {
    sender:null,
    senderFiles:null,
    recievers:[],
    files:[],
    errorCode:null,
    allReciever:null,
    completedState:0,
    isCompleted:null,
    allFiles:null,
    uri:[]
};

export default (state = initialState,action) => {
    switch(action.type){
        case FIND_SENDER:
            return{...state,
            sender:action.sender,
            errorCode:action.errorCode
        }
        case CLEAR:
            return{
                 state:initialState,
                 sender:action.sender
            }
        case SHARE:{

            return{...state,
                sender:action.sharingDetails.sender,
                recievers:state.state.recievers.concat(action.sharingDetails.recievers),
                files:state.state.recievers.concat(action.sharingDetails.files)
            }
        }

        case STORE_RECIEVER:
            return{
                ...state,
                allReciever:action.recieverData
            }
        
        case DISCONNECT_RECIEVER:
            return{
                ...state,
                errorCode:action.errorCode
            }
        case STORE_SENDER_FILES:
            return{
                ...state,
                senderFiles:action.senderFiles
                
            }
        case UPLOAD_FILES:
            return{
                ...state,
                completedState:action.completedState,
                isCompleted:action.isCompleted
            }
        case FETCH_FILES:
            return{
                ...state,
                allFiles:action.allFiles
            }
        case GET_URI:
            return{
                ...state,
                uri:state.state.uri.concat(action.uri)
            }

        default:
            return state
    }
}