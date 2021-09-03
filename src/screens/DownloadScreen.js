//the commented out were actually wrong actions, that action gives refrence to bucket of firebase storage(DOES NOT GIVE DYNAMIC URL).

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

//actions
import { getUri } from "../../store/actions/files";
import { StackActions } from "@react-navigation/core";

const DownloadScreen = (props) => {
  const sender_files = useSelector((state) => state.files.allFiles);
  const myUser = useSelector((state) => state.auth.users);
  const [initial, setInitial] = useState(false);
  const [done, setDone] = useState(false);
  // const uriS = useSelector(state => state.files.uri)
  // console.log('uriiiiiiiiii',uriS)
  // const dispatch = useDispatch();

  // const getUrL = async(fName) => {
  //     await dispatch(getUri(fName))
  // }

  const backToHome = () => {
    props.navigation.dispatch(
      StackActions.replace("Home", { username: myUser[0].name })
    );
  };

  useEffect(() => {
    if (done) {
      setTimeout(backToHome, 6000);
    }
  }, [done]);

  useEffect(() => {
    if (sender_files != undefined && sender_files.length > 0) {
      checkPermission();
    }
  }, [initial]);

  const checkPermission = async () => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === "ios") {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission Required",
            message:
              "Application needs access to your storage to download File",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile();
          console.log("Storage Permission Granted.");
        } else {
          // If permission denied then show alert
          Alert.alert("Error", "Storage Permission Not Granted");
        }
      } catch (err) {
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };

  const downloadFile = () => {
    //  sender_files.forEach((item,index) => getUrL(item.name))
    sender_files.forEach((item, index) => startDownload(item.url, item.type));
  };

  const startDownload = (fileUrl, type) => {
    //  console.log('ooooof',fileUrl)
    let date = new Date();
    let FILE_URL = fileUrl;

    let file_ext = getFileExtention(type);
    file_ext = "." + file_ext[1];
    console.log(file_ext);
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log("res -> ", JSON.stringify(res));
        setDone(true);
      });
  };

  const getFileExtention = (type) => {
    const x = type.split("/");
    return x;
  };

  return (
    <SafeAreaView style={styles.container}>
      {done ? (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.doneView}>
            <LottieView
              source={require("../../assets/finish.json")}
              autoPlay={true}
              loop={false}
            />
          </View>
          <View style={styles.jumpLotiView}>
            <LottieView
              source={require("../../assets/jump.json")}
              autoPlay={true}
              loop={false}
            />
          </View>
        </View>
      ) : (
        <View style={styles.downloadingView}>
          <LottieView
            source={require("../../assets/downloading.json")}
            autoPlay={true}
            loop={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#ffffff",
  },
  lotiView: {
    width: Dimensions.get("window").width * 0.8,
    height: Dimensions.get("window").height * 0.2,
    marginTop: 10,
  },
  jumpLotiView: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.4,
    top: Dimensions.get("window").height * 0.3,
  },
  doneView: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.3,
    top: Dimensions.get("window").height * 0.3,
  },
  downloadingView: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.23,
    top: Dimensions.get("window").height * 0.3,
  },
});

export default DownloadScreen;
