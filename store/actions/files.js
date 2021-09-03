import storage from '@react-native-firebase/storage';
import File from '../../models/File';

export const PATCH_TRANSFER_CODE = 'PATCH_TRANSFER_CODE';
export const VERIFY_CODE = 'VERIFY_CODE';
export const FIND_SENDER = 'FIND_SENDER';
export const CLEAR = 'CLEAR';
export const SHARE = 'SHARE';
export const STORE_RECIEVER = 'STORE_RECIEVER'
export const DISCONNECT_RECIEVER = 'DISCONNECT_RECIEVER';
export const STORE_SENDER_FILES = 'STORE_SENDER_FILES'
export const UPLOAD_FILES = 'UPLOAD_FILES';
export const FETCH_FILES = 'FETCH_FILES'
export const GET_URI = 'GET_URI'

export const patchTransferCode = (code) => {
    return async(dispatch,getState) => {
        const id = getState().auth.currentUser
        console.log('patch on idddd',id)
        await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/user/${id}.json`,{
            method:'PATCH',
            headers:{'Content-Type':'application\json'},
            body:JSON.stringify({
                transferCode:code
            })
        })
    }
}


export const verifyCode = (code,reciever) => {
    return async(dispatch,getState) =>{
        const allUsers = getState().auth.allUsers
        console.log('aaaaaaaaaaaaaaaaa',allUsers)
        const sender = allUsers.filter(user => user.transferCode === code)
        let errorCode = 0;
        console.log(reciever)
      //  console.log('ddddddddddddddddddddddddddddddd',transferC)

        if(sender.length === 0){
            errorCode = 400
            dispatch({type:FIND_SENDER,sender:sender,errorCode:errorCode})
        }
        else{
            const checkLength = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share/reciever.json`)
            const shareData = await checkLength.json();
            console.log('shared Data lenght',shareData);
            if(shareData === null){
                const response = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share.json`,{
                 method:'PATCH',
                 headers:{
                     'Content-Type':'application/json'
                 },
                 body:JSON.stringify({
                     sender:sender,
                     reciever:reciever,
                     files:[],
                     
                 })
             })
            }
            else if(shareData!==null){
                const rec = reciever[0].reciever
                const dp = reciever[0].dpUrl
                console.log('*********',rec)
                const arrayLength = shareData.length
                const addReciever = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share/reciever/${arrayLength}.json`,{
                    method:'PATCH',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        reciever:rec,
                        dpUrl:dp
                    })
                })
            }
            dispatch({type:SHARE,sharingDetails:{
                sender:sender,
                recievers:reciever,
                files:['files']


            }})
            dispatch({type:FIND_SENDER,sender:sender,errorCode:errorCode})
        }
        
    }
}

export const clearFileRed = () => {
    return async(dispatch,getState) => {
        const sender = getState().files.sender
        dispatch({type:CLEAR,sender:sender})
    }
}

export const fetchReciever = (sender_username) => {
    return async(dispatch,getState) => {
        const response = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender_username}/share/reciever.json`);
        const resData=await response.json()

        dispatch({type:STORE_RECIEVER,recieverData:resData})
    }
}


export const disconnect_reciever = (myUser) => {
    return async(dispatch,getState) => {
        const sender = getState().files.sender
        let errorCode = 0;
        console.log(sender);
        if(sender === null){
            
        }
        else{
            const recievers = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share/reciever.json`)
            const allReciever = await recievers.json();
            console.log('alllll:',allReciever);

            if(allReciever === null){
                console.log('none to be disconnect')
            }
            else{
                var indexOf = allReciever.findIndex(i => i.reciever === myUser);
                console.log(indexOf)
                
    
                if(indexOf === -1){
                    console.log('none to be disconnectttt')
                }
        
                    await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share/reciever/${indexOf}.json`,{
                    method:'DELETE'
                });
                errorCode = 200 //deleted
            }    

            
    
            dispatch({type:DISCONNECT_RECIEVER,errorCode:errorCode})
        }

    }
}

export const storeSenderFiles = (files) => {
    return async(dispatch) => {
        if(files){
            dispatch({type:STORE_SENDER_FILES,senderFiles:files})
        }
    }
}

 export const uploadFiles = (link,id,itemNo,sender,length,name,type) => {
     return async(dispatch,getState) => {
        console.log(link,'   ',itemNo);
          const image = await fetch(link);
          const blob = await image.blob();
          let completed
          let isCompleted = false

          const ref = storage().ref(`${'files/'}${sender}${'/'}${id}`);
          await ref.put(blob);

          const url = await storage().ref(`${'files/'}${sender}${'/'}${id}`).getDownloadURL();

          const response = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender}/share/files.json`,{
              method:'POST',
              headers:{'Content-Type':'application\json'},
              body:JSON.stringify({
                  item:url,
                  name:name,
                  type:type
              })
          })
          completed = itemNo/length
          if(itemNo === length){
              isCompleted = true
        }

          dispatch({type:UPLOAD_FILES,completedState:completed,isCompleted:isCompleted})
     }
 }


 export const fetchSenderFiles = () => {
    return async(dispatch,getState) => {
        const sender = getState().files.sender
        const response = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender[0].name}/share/files.json`);
        const resData = await response.json();

        const allFiles = [];
        for(const key in resData){
            allFiles.push(new File(resData[key].type,resData[key].name,resData[key].item,key))
        }
        dispatch({type:FETCH_FILES,allFiles:allFiles})
    }
 }


 export const getUri = (fileName) => {
     return async(dispatch,getState) => {
        const sender = getState().files.sender
        var gsReference = storage().refFromURL(`gs://zippy-7664e.appspot.com/files/${sender[0].name}/${fileName}`)
        dispatch({type:GET_URI,uri:gsReference})
     }
 }


 export const disconnect_sender = (sender) => {
    return async(dispatch,getState) =>{
        const response = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/fileSharing/${sender}.json`,{
            method:'DELETE'
        });
    }
 }