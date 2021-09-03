import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image,TouchableOpacity,Dimensions,Pressable,Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import DocumentPicker from 'react-native-document-picker';
import * as Permissions from 'expo-permissions';

const ImageTaker = (props) => {
  const [image, setImage] = useState();

  const permissionsHandler = async () => {
    const permission = await Permissions.askAsync(Permissions.CAMERA);
    if (permission.status != 'granted') {
      Alert.alert('Camera Permission', 'Required Camera Permission Not Granted !', [{ text: 'Okay' }]);
      return false;
    }
    return true;
  };

  const fileHandler = async () => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!permission) {
      return;
    }
    const imgFile = await ImagePicker.launchImageLibraryAsync({ allowsEditing:true,allowsMultipleSelection:true, mediaTypes: ImagePicker.MediaTypeOptions.Images,quality: 1 });
    setImage(imgFile.uri);
    props.onImageTaken(imgFile.uri);
  };

  const cameraHandler = async () => {
    const permission = await ImagePicker.getCameraPermissionsAsync();
    if (!permission) {
      return;
    }
    const imgFile = await  ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[2,2],
        quality:1
    });
    setImage(imgFile.uri);
    props.onImageTaken(imgFile.uri);
  };

  const allFilesHandler = async() => {
    try{
    const allFile = await await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
    });
    const tempArray = [];
    for(let i=0;i<allFile.length;i++) {
       const getAllData = {
         uri: `${allFile[i].uri}`,
         type: `${allFile[i].type}`,
         name: `${allFile[i].name}`,
         size: `${allFile[i].size}`,
       }
      tempArray.push(getAllData)
     }
     props.onImageTaken(tempArray)
    }catch(err){
      if(DocumentPicker.isCancel(err)){
        return
      }else{
        throw err;
      }
    }
  }

  return (
    <View>
    <Text style={{ fontSize:24, alignSelf:'center', marginVertical:16, color:'black'}}>File Uploads</Text>
    <Pressable onPress={allFilesHandler} style={{borderColor:'gray', borderBottomWidth:1, padding:8, borderRadius:8, width:'100%', alignSelf:'center', marginVertical:15, flexDirection:'row', justifyContent:'space-between'}}>
    <Entypo name="images" size={24} color="#08818a" style={{left:20}} />
    <Text style={{ fontSize:23, alignSelf:'center', color:'#08818a',right:20}}>From Device</Text>
    </Pressable>
    {/* <Pressable onPress={cameraHandler} style={{borderColor:'gray',borderBottomWidth:1, padding:8, borderRadius:8, width:'100%', alignSelf:'center', marginVertical:15, flexDirection:'row', justifyContent:'space-between'}}>
    <Entypo name="camera" size={24} color="#08818a" style={{left:20}} />
        <Text style={{ fontSize:24, alignSelf:'center', color:'#08818a', right:20}}>Open Camera</Text>
    </Pressable>
    <Pressable onPress={fileHandler} style={{borderColor:'gray',borderBottomWidth:1, padding:8, borderRadius:8, width:'100%', alignSelf:'center', marginVertical:15, flexDirection:'row', justifyContent:'space-between'}}>
    <Entypo name="camera" size={24} color="#08818a" style={{left:20}} />
        <Text style={{ fontSize:24, alignSelf:'center', color:'#08818a', right:20}}>Open Files</Text>
    </Pressable> */}
    </View>
  );
};

export default ImageTaker;