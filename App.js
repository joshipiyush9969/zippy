import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';

import {Provider} from 'react-redux'
import {applyMiddleware, createStore, combineReducers} from 'redux'
import ReduxThunk from 'redux-thunk'

//navigator
import AppNav from './src/navigator/AppNav';

//reducer
import AuthReducer from './store/reducer/Auth';
import FileReducer from './store/reducer/files';

const rootReducer = combineReducers({
  auth:AuthReducer,
  files:FileReducer
})

const store = createStore(rootReducer,applyMiddleware(ReduxThunk))

export default function App() {
  return<Provider store={store}><AppNav/></Provider>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
