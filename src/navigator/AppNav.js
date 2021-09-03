import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

//screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import QrScreen   from '../screens/QrScreen';
import CSendFiles from '../screens/CSendFiles';
import CRecieveFiles from '../screens/CRecieveFiles';
import OnProcessScreen from '../screens/OnProcessScreen';
import DownloadScreen from '../screens/DownloadScreen';

const AuthStack = createStackNavigator();

const MyAuth = () => {
    return(
        <AuthStack.Navigator initialRouteName={"Auth"} screenOptions={{headerShown:false}} >
            <AuthStack.Screen name="Auth" component={AuthScreen}/>
        </AuthStack.Navigator>
    );
};

const HomeStack = createStackNavigator();

const MyHome = () => {
    return(
        <HomeStack.Navigator initialRouteName={"Auth"} screenOptions = {{headerShown:false}}>
            <HomeStack.Screen name = "Auth" component = {MyAuth}/>
            <HomeStack.Screen name = "Home" component = {HomeScreen}/>
            <HomeStack.Screen name = "Qr"   component = {QrScreen}/>
            <HomeStack.Screen name = "OnProcess"   component = {OnProcessScreen}/>
            <HomeStack.Screen name = "CSend"   component = {CSendFiles}/>
            <HomeStack.Screen name = "CRecieve"   component = {CRecieveFiles}/>
            <HomeStack.Screen name = "Download"   component = {DownloadScreen}/>
        </HomeStack.Navigator>
    )
}

const MainDrawer = createDrawerNavigator();

const MyMainDrawer = () => {
    return(
        <MainDrawer.Navigator initialRouteName={"Auth"}>    
            <MainDrawer.Screen name= "Home" component={HomeScreen}/>

        </MainDrawer.Navigator>
    );
};

const FlowStack = createStackNavigator()

const AppNav = () => {
    return(
        <NavigationContainer>
            <FlowStack.Navigator screenOptions={{headerShown:false}}>
                <FlowStack.Screen name='Auth' component = {MyHome}/>
            </FlowStack.Navigator>
        </NavigationContainer>
    )
}

export default AppNav