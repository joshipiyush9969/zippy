import React, { useEffect } from 'react';
import { useState} from 'react';
import {View,Text,Button, SafeAreaView, Dimensions,Switch,Alert} from 'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch,useSelector} from 'react-redux';

//actions
import * as authActions from '../../store/actions/Auth';
//components 
import AvatarComp from '../components/avatarComp';

const AuthScreen = (props) => {
    const [profileUri, setProfileUri] = useState()
    const [name, setName] = useState('')
    const [realName,setRealName] = useState('')
    const[isSignUp,setIsSignUp] =useState(false);

    const[error,setError] = useState();


   const dispatch = useDispatch();

   useEffect(()=>{
    if(error){
        return(
        Alert.alert('An Error Occured',error,[{text:'Okay'}])
        );
    }
},[error])


    const create = async() => {
        setError(null);
        try{
            if(isSignUp && profileUri!=null && name.trim().length>0 && realName.trim().length>0){
                
                await dispatch(authActions.login(name,'Signup'))
                await dispatch(authActions.userCreation(name,realName,profileUri))

                console.log('dispatch')
             //   props.navigation.navigate('Home',{username:name});
             setIsSignUp(!isSignUp)
            }
            else if (!isSignUp && name.trim().length>0){
               await dispatch(authActions.login(name,'Login'))
               props.navigation.navigate('Home',{username:name});
            }
            else{
                Alert.alert('Invalid Details','Please enter all the details',[{text:'Okay'}])
            }
        }
        catch(err){
            console.log('errrrrrr:',err.message)
            setError(err.message);
            setName('')
        }
        

    }
    
    const {width:screenWidth, height:screenHeight} = Dimensions.get('window')

    const getUri = (events) =>{

        console.log(events)
        setProfileUri(events)
    }

    const userImage =['https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_001.jpg?alt=media&token=f73f3b36-70d7-4621-9c83-8df0bbb77f0e',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_002.jpg?alt=media&token=114fc4e9-2262-47df-8e34-946075db864b',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_003.jpg?alt=media&token=b33d2f81-8dba-4742-bf25-0dd586bca591',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_004.jpg?alt=media&token=35023d7c-5be2-4c18-a54b-097ef3d0809b',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_006.jpg?alt=media&token=35858bcf-d0bf-4b6f-a3b3-b4c6f5d21fd7',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_007.jpg?alt=media&token=21f87879-91fa-4549-81ed-169f455fc5f2',
'https://firebasestorage.googleapis.com/v0/b/zippy-7664e.appspot.com/o/image_part_008.jpg?alt=media&token=c39f2914-b6d8-4d43-b677-352c042bc4c8']

    return(
        <SafeAreaView>
            <ScrollView>
                <View style={{width:screenWidth, height:screenHeight}}>
                <View style={{flexDirection:'row', width:'100%'}}>   
           
           <View style={{height:screenHeight*0.17, width:screenWidth*0.45, backgroundColor:'rgb(206,151,176)',borderRadius:0,borderBottomRightRadius:0, borderBottomLeftRadius:100, borderTopLeftRadius:0,opacity:3}}>
           </View>
           <View style={{height:screenHeight*0.17, width:screenWidth*1, backgroundColor:'#f4a9a8', borderRadius:100, right:75, borderTopRightRadius:0, borderBottomRightRadius:0}}>
           </View>
           <View style={{width:'100%', position:'absolute', justifyContent:'center', height:'100%'}}>
               <Text style={{ fontSize:30,fontStyle:'italic', color:'white', alignSelf:'center'}}>Zippy</Text>
           </View>

        </View>

        {isSignUp?<View style={{width:Dimensions.get('window').width, height:160, marginVertical:16}}>
        
        <FlatList
            showsHorizontalScrollIndicator ={false}
            horizontal
            style={{alignSelf:'center'}}
            data={userImage}
            keyExtractor ={x=>x}
            renderItem = {({item}) => {
                return<AvatarComp
                    list = {item}
                    setUri = {getUri}
                    selectedUri = {profileUri}
                />
            }}
        />
       <Text style={{fontFamily:'medium', fontSize:20,alignSelf:'center'}}>Select An Avatar For You</Text>
        </View>:null}
        <TextInput
            value = {name}
            onChangeText = {(text)=>setName(text)}
            mode = 'outlined'
            label = 'Enter Username'
            theme ={{colors:{primary:'rgb(206,151,176)',underlineColor:'trasparent'}}}
            style={{ fontColor: '#f4a9a8', height: 60, width: Dimensions.get('screen').width*0.95, alignSelf:'center',padding:15 }}
        />
        {isSignUp?<TextInput
            value = {realName}
            onChangeText = {(text)=>setRealName(text)}
            mode = 'outlined'
            label = 'Full Name'
            theme ={{colors:{primary:'rgb(206,151,176)',underlineColor:'trasparent'}}}
            style={{ fontColor: '#f4a9a8', height: 60, width: Dimensions.get('screen').width*0.95, alignSelf:'center',padding:15 }}
        />:null}

       <TouchableOpacity onPress={create} style={{alignItems:'center'}}>    
        <LinearGradient 
        start={{x: 0, y: 0.85}} end={{x: 1, y: 0.25}}
        // Button Linear Gradient
        colors={['#f4a9a8','rgb(206,151,176)']}
        style={{ padding: 15, alignItems: 'center', borderRadius: 30, width:'90%',alignSelf:'center', marginVertical:20 }}>
        {isSignUp?<Text style={{color:'white', fontSize:20}}>Create Profile</Text>:<Text style={{color:'white', fontSize:20}}>Proceed</Text>}
        </LinearGradient>
        </TouchableOpacity>
        <View style={{alignItems:'center',marginVertical:5,justifyContent:'center',width:'100%',marginVertical:30,transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}>
                    <Switch
                     trackColor={{ false: "#967282", true: '#f74393' }}
                     thumbColor={isSignUp ? "#f4a9a8" : "#f4a9a8"}
                     onValueChange={()=>setIsSignUp(prevState=>!prevState)} 
                     value={isSignUp}
                     />
            {isSignUp?<Text style={{fontSize:10}}>Already In Zippy? Switch to Login</Text>:
            <Text style={{fontSize:10}}>First Time? Switch to Sign Up</Text>}
            </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export default AuthScreen;