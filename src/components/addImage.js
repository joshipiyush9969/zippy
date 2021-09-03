import React from 'react'
import { Dimensions, Image,  Text, View,TouchableOpacity } from 'react-native'
import { AntDesign  } from '@expo/vector-icons'; 

const {width, height} = Dimensions.get('window')

const addImage = (props) => {
    const filePath = 'https://firebasestorage.googleapis.com/v0/b/mineral-concord-314020.appspot.com/o/brooke-lark-HlNcigvUi4Q-unsplash.jpg?alt=media&token=c278eb9e-081e-4193-9dbe-febeb7fb8e68'

    return(
        
        <TouchableOpacity onPress={props.onPress} style={{width:width*0.94, height:height*0.35, alignSelf:'center', borderRadius:8, marginVertical:8, justifyContent:'center'}}>
        <View style={{width:'100%', height:'100%', backgroundColor:'black',  borderRadius:8,justifyContent:'center'}}>
        <Image
            blurRadius={props.img?null:4}
            style={{height:'100%', width:'100%', borderRadius:8, position:'absolute',opacity:props.img?null:0.8}} 
            source={{uri:props.img?props.img:filePath}} 
            resizeMode={props.img?'cover':null}
        />
        {props.img?null:
            <AntDesign  name="pluscircle" size={45} color={'white'} style={{alignSelf:'center'}}/>
        }

        </View>
        </TouchableOpacity>
        

    )
};

export default addImage;