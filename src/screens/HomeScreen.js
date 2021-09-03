import React, { useEffect,useState,useRef } from 'react';
import {View,Text,Button,SafeAreaView,Dimensions,Image,Switch} from 'react-native';
import { ScrollView, TouchableOpacity,FlatList } from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import { DrawerActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect } from '@react-navigation/native';

//components
import HomeTab from '../components/homeTab';
import ImageTaker from '../components/ImageTaker';
import AddImage from '../components/addImage';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 

//actions
import * as authAction from '../../store/actions/Auth';
import { clearFileRed } from '../../store/actions/files';
import { disconnect_reciever } from '../../store/actions/files';
import { storeSenderFiles } from '../../store/actions/files';

const HomeScreen = (props) => {
    const modalizeRef = useRef(null);

    const [isTruncatedText, setIsTruncatedText] = useState(false);
    const [showMore, setShowMore] = useState(true);

    const {username} = props.route.params;
    const[isRtd,setIsRtd] = useState(true);

    const[img,setImg]=useState([])

    const dispatch = useDispatch();
    const myUser = useSelector(state => state.auth.users);
    

    const onOpen = async() => {
        modalizeRef.current?.open();
    };

    const onClose = async() => {
        modalizeRef.current?.close();
    };

    const imagetaken=(file)=>{
        setImg(file)
    }

    const clearFiles = async() => {
        await dispatch(disconnect_reciever(myUser[0].name)) 
        await dispatch(clearFileRed())
       
    }

    useFocusEffect(
        React.useCallback(() => {
            clearFiles();
        }, [])
      );


   useEffect(()=>{
       loadUser();

   },[dispatch,username])


   const loadUser = async() => {
    await dispatch(authAction.login(myUser[0].name,'Fetch'))
    console.log('heyyy ',myUser,myUser[0].name)
   }

   const onProceed = async() => {
    await dispatch(storeSenderFiles(img))
    props.navigation.navigate('Qr',{sharingStatus:isRtd,who:myUser,sharingType:'Send',fData:img});
    onClose();
   }


    const {width:screenWidth, height:screenHeight} = Dimensions.get('window')
    return(
        <SafeAreaView style={{backgroundColor:'#ffffff'}}>
            <ScrollView>
            <View style={{width:screenWidth, height:screenHeight}}>
                <View style={{flexDirection:'row', width:'100%'}}>   
           
           <View style={{height:screenHeight*0.16, width:screenWidth*0.45, backgroundColor:'rgb(206,151,176)',borderRadius:0,borderBottomRightRadius:0, borderBottomLeftRadius:100, borderTopLeftRadius:0,opacity:3}}>
           </View>
           <View style={{height:screenHeight*0.16, width:screenWidth*1, backgroundColor:'#f4a9a8', borderRadius:100, right:75, borderTopRightRadius:100, borderBottomRightRadius:0}}>
           </View>
           <View style={{width:'100%', position:'absolute', justifyContent:'center', height:'100%'}}>
               <Image 
                    style={{height:'100%', width:'40%', borderRadius:100, position:'absolute',alignSelf:'center',left:'26%'}}
                    source={{uri:myUser[0].dpUrl}}/>
           </View>
           

        </View>
        <LinearGradient         
            start={{x: 0, y: 0.85}} end={{x: 1, y: 0.25}}
            // Button Linear Gradient
            colors={['rgb(206,151,176)','#f4a9a8']}
            style={{height:screenHeight*0.04,alignSelf:'center', backgroundColor:'#cccccc',borderColor:'#f4a9a8',right:'2%' ,borderRadius:0, borderBottomLeftRadius:100,borderBottomRightRadius:100}}>
        <View>
        <Text style={{ marginHorizontal:20,fontSize:15,fontStyle:'italic', color:'white', alignSelf:'center',justifyContent:'center',right:'40%',flexDirection:'row'}}>
                        <Text style={{color:'white'}}>@</Text>
                        <Text style={{color:'white'}}>{myUser[0].name}</Text>
                    </Text>
           </View>
           </LinearGradient>
        <View style={{marginVertical:10}}>
        <HomeTab
                    index={0}
                    stext={'Share Files With Your Friends'}
                    text={'Send Files'}
                   onPress = {onOpen}
        />
        <HomeTab
                    index={1}
                    stext={'Request And Get Those Files'}
                    text={'Recieve Files'}
                    onPress = {()=>{props.navigation.navigate('Qr',{sharingStatus:isRtd,who:myUser,sharingType:'Recieve'})}}
        />
        
        </View>
        <View style={{alignItems:'center',marginVertical:5,justifyContent:'center',width:'100%',marginVertical:30,transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}>
        <Text style={{fontSize:12}}>Send Files Using</Text>
                    <Switch
                     trackColor={{ false: "#9f98e8", true: '#f74393' }}
                     thumbColor={isRtd ? "#f4a9a8" : "#aff6cf"}
                     onValueChange={()=>setIsRtd(prevState=>!prevState)} 
                     value={isRtd}
                     />
            {isRtd?<Text style={{fontSize:10}}>Cloud</Text>:
            <Text style={{fontSize:10}}>Wifi/Hotspot</Text>}
            </View>


        </View>
            </ScrollView>
            <Modalize  ref={modalizeRef}>
                <View>
                    <ImageTaker onImageTaken={imagetaken} />

                    {img.length!=0?
                        <TouchableOpacity onPress = {onProceed}
                            style={{alignItems:'center'}}>    
                            <LinearGradient 
                            start={{x: 0, y: 0.85}} end={{x: 1, y: 0.25}}
                            // Button Linear Gradient
                            colors={['#08818a','#0ca2ad']}
                            style={{ padding: 10, alignItems: 'center', borderRadius: 30, width:'70%',alignSelf:'center', marginVertical:20 }}>
                            <Text style={{color:'white', fontSize:20}}>Proceed</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                   :null}

                    <FlatList
                    numColumns={2}
                data={img}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity>
                        {(item.type.includes('image')||item.type.includes('video')) ?
                        <View style={{marginHorizontal:20,borderRadius:10,marginVertical:10}}>
                             <Image style={{width:Dimensions.get('window').width*0.4,
                            borderRadius:10,height:Dimensions.get('window').height*0.3,
                            alignSelf:'center'}} source={{uri:item.uri}}/>
                             <Text 
                                numberOfLines={2} style={{fontSize:15,width:Dimensions.get('window').width*0.4}}>
                                    {item.name}
                             </Text>
                        </View>
                        :(item.type.includes('pdf'))?
                        <View style={{width:Dimensions.get('window').width*0.4,marginHorizontal:20,marginVertical:10,borderWidth:1,padding:2,borderRadius:10,height:Dimensions.get('window').height*0.3,justifyContent:'center',alignItems:'center'}}>
                         <AntDesign name="pdffile1" size={90} color="#ff6259" />
                         <Text 
                              numberOfLines={2} style={{fontSize:15}}
                              
                            >{item.name}</Text>
                          <Text  numberOfLines={2} style={{fontSize:15}}>{item.type}</Text> 
                     </View>
                        :
                            <View style={{width:Dimensions.get('window').width*0.4,marginHorizontal:20,marginVertical:10,borderWidth:1,padding:2,borderRadius:10,height:Dimensions.get('window').height*0.3,justifyContent:'center',alignItems:'center'}}>
                                <MaterialIcons name="insert-drive-file" size={50} color="#0ca2ad" />
                                <Text 
                                     numberOfLines={2} style={{fontSize:15}}
                                      
                                   >{item.name}</Text>
                                 <Text numberOfLines={2} style={{fontSize:15}}>{item.type}</Text> 
                            </View>
                            }
                        </TouchableOpacity>
                        )
                }}
            />
                        
                </View>
            </Modalize>

          
        </SafeAreaView>
    )
};

export default HomeScreen;