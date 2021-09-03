import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Dimensions, Button, Alert, StyleSheet, Image } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-paper';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { clearFileRed } from '../../store/actions/files';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StackActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
} from 'react-native-indicators';

import QRCode from 'react-native-qrcode-svg';

//actions
import { patchTransferCode } from '../../store/actions/files';
import { verifyCode } from '../../store/actions/files';
import { useDispatch, useSelector } from 'react-redux';
import { disconnect_reciever } from '../../store/actions/files';

const QrScreen = (props) => {
    const senderDetails = useSelector(state => state.files.sender);
    const errorCode = useSelector(state => state.files.errorCode)
    const myUser = useSelector(state => state.auth.users);
    console.log(myUser[0].dpUrl);
    console.log('my maaaaaaan', senderDetails, errorCode)

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);

    const { sharingStatus, who, sharingType, fData } = props.route.params;

    const [qrCode, setQrCode] = useState('');
    const [recieverCode, setRecieverCode] = useState('');
    const [isQr, setIsQr] = useState(false);
    const [isHelp, setIsHelp] = useState(false);
    const [done, setDone] = useState(false);

    const dispatch = useDispatch();

    const { height: screenHeight, width: screenWidth } = Dimensions.get('screen')

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        if (recieverCode === data) {
            Alert.alert('Same QR', 'The code is similar to your previous one', [{ text: 'Okay' }])
        }
        else {
            setRecieverCode(data)
        }

    };
    if (hasPermission === null) {
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ alignSelf: 'center' }}>Requesting for camera permission</Text>
            <DotIndicator size={10} color='#f4a9a8' />
        </View>)


    }
    if (hasPermission === false) {
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>No Access To Camera</Text>
        </View>)
    }

    const reScan = async () => {
        setScanned(false);
        await dispatch(clearFileRed())
    }


    const randomString = (length, chars) => {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        // console.log(result);
        console.log(sharingStatus, who, sharingType)
        console.log('Choosed Files: ', fData)
        return result;

    }

    const copyToClipboard = () => {
        Clipboard.setString(qrCode)
    }


    const verifyQr = async () => {
        if (recieverCode.trim().length > 0) {
            setLoading(true)
            await dispatch(verifyCode(recieverCode, [{ reciever: myUser[0].name, dpUrl: myUser[0].dpUrl }], [{ dpUrl: myUser[0].dpUrl }]))
            setLoading(false)
        }
        else {
            return (
                Alert.alert('Invalid Input', 'Enter or scan the QR code', [{ text: 'Okay' }])
            )
        }

    }

    const dis = async () => {
        await dispatch(disconnect_reciever(myUser[0].name));
        props.navigation.navigate('Home')
    }

    const recieveFile = () => {
        console.log('take it to a screen where he/she get all the files')
        props.navigation.dispatch(
            StackActions.replace('CRecieve')
        );
    }

    const proceedWithCode = async () => {
        console.log(qrCode);
        await dispatch(patchTransferCode(qrCode))
        props.navigation.navigate('OnProcess')
    }

    const generateQr = () => {
        var rStrinG = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&$#@)(?');
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var time = today.getHours() + "#" + today.getMinutes() + "#" + today.getSeconds();

        var date = mm + '$' + dd + '$' + yyyy;
        var RandomString = rStrinG + date + time;
        setQrCode(RandomString);
        setIsQr(true);

    }

    return (
        <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {sharingStatus === true ? <View style={{ width: screenWidth, height: screenHeight }}>
                    {sharingType === 'Send' ? <View style={{ padding: 10, borderRadius: 9, borderColor: 'rgb(206,151,176)', alignSelf: 'center', borderWidth: isQr ? 2 : 0, marginTop: 20 }}>
                        {isQr ? <QRCode size={200} value={qrCode} />
                            : null
                        }
                    </View> :
                        <View style={{ marginVertical: 10 }}>

                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={{ height: screenHeight * 0.5, width: screenWidth * 1 }}
                            />
                            {scanned &&
                                <TouchableOpacity onPress={reScan} style={{ alignItems: 'center' }}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0.85 }} end={{ x: 1, y: 0.25 }}
                                        // Button Linear Gradient
                                        colors={['#5c5c5c', '#404040']}
                                        style={{ padding: 8, alignItems: 'center', borderRadius: 10, width: '50%', alignSelf: 'center', marginVertical: 5 }}>
                                        <Text style={{ color: 'white', fontSize: 15 }}>Scan Again</Text>
                                    </LinearGradient>
                                </TouchableOpacity>}
                        </View>


                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {sharingType === 'Send' ? <TextInput
                            value={qrCode}
                            mode='outlined'
                            disabled={true}
                            label='Code'
                            theme={{ colors: { primary: 'rgb(206,151,176)', underlineColor: 'trasparent' } }}
                            style={{ fontColor: '#f4a9a8', height: 60, width: Dimensions.get('screen').width * 0.80, alignSelf: 'center', padding: 10 }}
                        /> :
                            <TextInput
                                value={recieverCode}
                                mode='outlined'
                                disabled={false}
                                onChangeText={setRecieverCode}
                                label='Enter Code'
                                theme={{ colors: { primary: 'rgb(206,151,176)', underlineColor: 'trasparent' } }}
                                style={{ fontColor: '#f4a9a8', height: 60, width: Dimensions.get('screen').width * 0.80, alignSelf: 'center', padding: 10 }}
                            />}
                        <TouchableOpacity onPress={copyToClipboard} style={{ alignItems: 'center' }}>
                            <LinearGradient
                                start={{ x: 0, y: 0.85 }} end={{ x: 1, y: 0.25 }}
                                // Button Linear Gradient
                                colors={['#5c5c5c', '#404040']}
                                style={{ padding: 11, alignItems: 'center', borderRadius: 10, width: '100%', alignSelf: 'center', marginVertical: 0 }}>
                                <Text style={{ color: 'white', fontSize: 15 }}>Copy</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {isHelp ? <View style={{ padding: 0, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold' }}> {sharingType === 'Send' ? 'Send this code to the reciever' : 'Ask Your friend for the code'}</Text>
                        {errorCode != undefined && errorCode === 0 && sharingType != 'Send' ?
                            <TouchableOpacity onPress={dis}
                                style={{ margin: 10, paddingVertical: 5, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#ff6363' }}>
                                <Text style={{ color: '#ffffff' }}>Disconnect</Text>
                            </TouchableOpacity> : null}

                    </View> :
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {errorCode != undefined && errorCode === 0 && sharingType != 'Send' ? <TouchableOpacity onPress={dis}
                                style={{ margin: 10, paddingVertical: 5, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#ff6363' }}>
                                <Text style={{ color: '#ffffff' }}>Disconnect</Text>
                            </TouchableOpacity> : null}
                            <TouchableOpacity onPress={() => setIsHelp(true)} style={{ marginHorizontal: 5, alignItems: 'flex-end' }}>
                                <Feather name="info" size={24} color="#a8a7a7" />
                            </TouchableOpacity>
                        </View>
                    }




                    {sharingType === 'Send' ? <TouchableOpacity onPress={generateQr} style={{ alignItems: 'center' }}>
                        <LinearGradient
                            start={{ x: 0, y: 0.85 }} end={{ x: 1, y: 0.25 }}
                            // Button Linear Gradient
                            colors={['#f4a9a8', 'rgb(206,151,176)']}
                            style={{ padding: 15, alignItems: 'center', borderRadius: 30, width: '80%', alignSelf: 'center', marginVertical: 20 }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>{isQr ? 'Generate Again' : 'Generate Code'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                        : <View>

                            {errorCode != undefined ? errorCode === 400 ? <Text style={{ alignSelf: 'center' }}>Cannot Find Any User With This Code</Text>
                                :
                                <View style={{ height: '25%', width: '100%', alignItems: 'center' }}>
                                    <View style={{ width: '100%', position: 'relative', justifyContent: 'center', height: '85%' }}>
                                        {!loading ? <Image
                                            style={{ height: '100%', width: '20%', borderRadius: 100, position: 'relative', alignSelf: 'center' }}
                                            source={{ uri: senderDetails[0].dpUrl }} /> : <DotIndicator size={10} color='#f4a9a8' />}
                                    </View>
                                    <Text>You're connected to {senderDetails[0].realName}</Text>
                                </View> : null}

                            {!loading ? <TouchableOpacity onPress={errorCode === undefined ? verifyQr : errorCode === 400 ? verifyCode : recieveFile} style={{ alignItems: 'center' }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0.85 }} end={{ x: 1.7, y: 0.25 }}
                                    // Button Linear Gradient
                                    colors={['#9f98e8', '#aff6cf']}
                                    style={{ padding: 9, alignItems: 'center', borderRadius: 30, width: '75%', alignSelf: 'center', marginVertical: 20 }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'normal' }}>{errorCode === undefined ? 'Verify Code' : errorCode === 400 ? 'Verify Code' : 'Recieve Files'}</Text>
                                </LinearGradient>
                            </TouchableOpacity> : <DotIndicator size={10} color='#9f98e8' />}

                        </View>
                    }



                    {sharingType === 'Send' && isQr ? <TouchableOpacity onPress={proceedWithCode}>
                        <LinearGradient
                            start={{ x: 0, y: 0.85 }} end={{ x: 1.7, y: 0.25 }}
                            // Button Linear Gradient
                            colors={['#9f98e8', '#aff6cf']}
                            style={{ padding: 15, alignItems: 'center', borderRadius: 30, width: '80%', alignSelf: 'center', marginVertical: 20 }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Proceed</Text>
                        </LinearGradient>
                    </TouchableOpacity> : null}

                </View> :
                    <View style={styles.container}>
                        <Text style={{ fontSize: 15, color: 'black' }}>File Sharing Without Internet</Text>
                        <Text style={{ fontSize: 15, color: 'black' }}>(Peer To Peer)</Text>
                        <View style={styles.lotiView}>
                            <LottieView source={require('../../assets/soon.json')} autoPlay={true} loop={false} />

                        </View>
                    </View>
                }



            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    lotiView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.25,
        backgroundColor: '#ffffff'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: '#ffffff',
        justifyContent: 'center'

    }
})

export default QrScreen;