import User from "../../models/User";

export const USER_CREATE = 'USER_CREATE';
export const CHECK_USERNAME = 'CHECK_USERNAME';
export const LOGIN = 'LOGIN';
export const FETCH_A_USER = 'FETCH_A_USER';


export const userCreation = (name,realName,dpUrl) => {
    return async dispatch => {
        const response  = await fetch(`https://zippy-7664e-default-rtdb.firebaseio.com/user.json`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name:name,
                realName:realName,
                dpUrl:dpUrl,
                password:''
            })
        })
        const resData = await response.json();
      //  console.log(resData.name);

        dispatch({
            type:USER_CREATE,
            userCredentials:{
                id:resData.name,
                name,
                realName,
                dpUrl,
                password:''
            }
        })
    }
}


 export const login = (username,sL) => {
     return async dispatch => {
         const response = await fetch('https://zippy-7664e-default-rtdb.firebaseio.com/user.json');
         const resData = await response.json();
         //console.log('***********',resData);
         const allUsers = [];
         for (const key in resData){
             allUsers.push(new User(key,resData[key].name,resData[key].realName,resData[key].dpUrl,resData[key].pass,resData[key].transferCode))
         }
         //console.log('everyone',allUsers);
         const users = allUsers.filter(user => user.name === username)
         console.log("************",users);
         let message = '';
         if(sL === 'Login'){
            if(users.length === 0){
                message = 'Username does not exist'
                console.log(message);
                throw new Error(message);
            }
            else{
               dispatch({type:LOGIN,users:users})
               console.log('checked Login!!')
            }
         }
         else if(sL === 'Fetch'){
             if(users.length!=0){
                 dispatch({type:FETCH_A_USER,users:users,current:users[0].id,allUsers:allUsers})
                 console.log('brrrrrrrrrrrrrrrrrh',users[0].id)
                 console.log("fetched!",users);
             }
             else{
                 message = 'Try Again Later'
                 throw new Error(message);
             }
         }

         else{
             if(users.length!=0){
                 message = 'Username Already Taken'
                 console.log(message);
                 throw new Error(message);
             }
             else{
                dispatch({type:LOGIN,users:users})
                console.log('checked SignUp!!')
             }
         }

         
     }
 }

