import React from 'react'
import { Dimensions, Image,  Text, View,TouchableOpacity } from 'react-native'

const {width, height} = Dimensions.get('window')

const HomeTab = ({text, stext, index, onPress}) => {

    const filePath = [
        'https://i.pinimg.com/originals/d5/af/3e/d5af3e3a0c574fe5fc6a61a8a6859411.jpg',
        'https://i.pinimg.com/originals/07/74/d6/0774d6700b58dd47b5583e443a51a37c.jpg',
        'https://firebasestorage.googleapis.com/v0/b/mineral-concord-314020.appspot.com/o/tamanna-rumee-R4viFLEqOWU-unsplash.jpg?alt=media&token=f63a6543-3d48-4996-8a6a-fdea385cbffc']

    return(<TouchableOpacity onPress={onPress}>
        <View style={{width:width*0.94, height:height*0.25, alignSelf:'center', borderRadius:8, marginVertical:8}}>
        <View style={{width:'100%', height:'100%', backgroundColor:'black', opacity:0.6, borderRadius:8}}>
        <Image
            blurRadius={1.5}
            style={{height:'100%', width:'100%', borderRadius:8}} 
            source={{uri:filePath[index]}} 
        />
        </View>
        <View style={{position:'absolute', padding:10}}>
            <Text style={{fontFamily:'medium', fontSize:20, color:'white'}}>{text}</Text>
            <Text style={{fontFamily:'book', fontSize:18, color:'white'}}>{stext}</Text>
        </View>
            
        </View>
        </TouchableOpacity>
    )

}

export default HomeTab