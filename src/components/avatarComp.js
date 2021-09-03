import React, { useState } from 'react'
import {View, Image} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const AvatarComp = (props) => {

   

    const width= ()=>{
    if(props.selectedUri === props.list){

        return 3

    }else{

        null

        }
    }

    const color = ()=>{
        if(props.selectedUri === props.list){
    
            return '#f4a9a8'
    
        }else{
    
            null
    
            }
        }

    
    
    return(
        
        <View style={{width:100, height:100, backgroundColor:'gray', borderRadius:100, alignSelf:'center', margin:10, justifyContent:'center',borderWidth:width(), borderColor:color()}}>
        <TouchableOpacity  onPress={()=>props.setUri(props.list)}>
        
        <Image 
            source={{uri:props.list}}
            style={{height:'100%', width:'100%', borderRadius:100}}
        />
       
        </TouchableOpacity>
        </View>
       
    )

}
export default AvatarComp