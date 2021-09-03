import React, { useEffect, useState } from 'react';
import {View,Text,Image, Dimensions,StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReciever } from '../../store/actions/files';
import LinearGradient from 'react-native-linear-gradient';
import { patchTransferCode } from '../../store/actions/files';
import { StackActions } from '@react-navigation/native';


const OnProcessScreen = (props) => {
    const[initial,setInitial] = useState(false);
    const dispatch = useDispatch();

     useEffect(()=>{
        const id =  setInterval(findRecievers,8000)
     },[initial])

    // const getId = () => {

    // }

    const myUser = useSelector(state => state.auth.users);
    const reciever_data = useSelector(state => state.files.allReciever);
    console.log(reciever_data);

    const findRecievers = async() => {
        await dispatch(fetchReciever(myUser[0].name))
    }

    const onConfirm = async() => {
        await dispatch(patchTransferCode('closed'))
        props.navigation.dispatch(
            StackActions.replace('CSend')
          );
    }

    return(
        <View style={styles.container}>
            <View style={styles.lotiView}>
            <LottieView source={require('../../assets/lf30_editor_p4p0rujd.json')} autoPlay={true}/>
            </View>


            <View style={{width:'100%',justifyContent:'space-between'}}>
                <View style={{height:150,width:'100%',alignItems:'center'}}>
                <Image 
                    style={{height:100, width:100, borderRadius:100, position:'relative',borderWidth:3,borderColor:'#f4a9a8'}}
                    source={{uri:myUser[0].dpUrl}}/>
                <Text>{myUser[0].realName}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    <FlatList horizontal={true} 
                    data={reciever_data} keyExtractor={(item, index) => 'key'+index}
                    renderItem = {(itemData) =>{
                       // console.log(itemData)
                        if(itemData.index <3)
                        return(
                            <View style={{height:60 ,width:60,margin:30,alignItems:'center'}}>
                            <Image 
                            style={{height:'100%', width:'100%', borderRadius:100,borderWidth:2,borderColor:'#9f98e8'}}
                            source={{uri:itemData.item.dpUrl}}/>
                            <Text>{itemData.item.reciever}</Text>
                            </View>
                        )
                    }} />
                                        <FlatList horizontal={true} 
                    data={reciever_data} keyExtractor={(item, index) => 'key'+index}
                    renderItem = {(itemData) =>{
                       // console.log(itemData)
                        if(itemData.index >3)
                        return(
                            <View style={{height:60 ,width:60,margin:30,alignItems:'center'}}>
                            <Image 
                            style={{height:'100%', width:'100%', borderRadius:100,borderWidth:2,borderColor:'#9f98e8'}}
                            source={{uri:itemData.item.dpUrl}}/>
                            <Text>{itemData.item.reciever}</Text>
                            </View>
                        )
                    }} />
                </View>
            </View>

            {reciever_data?<TouchableOpacity onPress={onConfirm}>
                    <LinearGradient 
                     start={{x: 0, y: 0.85}} end={{x: 1.9, y: 0.25}}
                 // Button Linear Gradient
                     colors={['#9f98e8','#aff6cf']}
                    style={{ padding: 12, alignItems: 'center', borderRadius: 10, width:'100%',alignSelf:'center', marginVertical:20 }}>
                    <Text style={{color:'white', fontSize:20}}>Confirm</Text>
                   </LinearGradient>
                    </TouchableOpacity>:null}
            
        </View>
            
      
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        backgroundColor:'#ffffff'
    },
    lotiView:{
        width:Dimensions.get('window').width*0.8,
        height:Dimensions.get('window').height*0.2
    }
})

export default OnProcessScreen