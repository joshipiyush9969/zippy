import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import { ProgressBar } from "react-native-paper";
const { width, height } = Dimensions.get("window");

//actions
import { uploadFiles } from "../../store/actions/files";
import { disconnect_sender } from "../../store/actions/files";

const CSendFiles = (props) => {
  const [status, setStatus] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const dispatch = useDispatch();
  const myUser = useSelector((state) => state.auth.users);
  const senderDetails = useSelector((state) => state.files.senderFiles);
  const fileStatus = useSelector((state) => state.files.completedState);
  const success = useSelector((state) => state.files.isCompleted);
  console.log("********", fileStatus, " ", status, " ", isUploaded);

  const uploadFile = async (item, id, itemNumber, itemName, type) => {
    await dispatch(
      uploadFiles(
        item,
        id,
        itemNumber + 1,
        myUser[0].name,
        senderDetails.length,
        itemName,
        type
      )
    );
  };

  useEffect(() => {
    const backButton = () => {
      BackHandler.addEventListener("hardwareBackPress", function () {
        return true;
      });
    };
    backButton();
  }, []);

  const endSession = () => {
    Alert.alert(
      "Ending Session",
      "Recievers wont be able to recieve files anymore",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Okay", onPress: async () => await backToHome() },
      ]
    );
  };

  const backToHome = async () => {
    await dispatch(disconnect_sender(myUser[0].name));
    props.navigation.dispatch(
      StackActions.replace("Home", { username: myUser[0].name })
    );
  };
  useEffect(() => {
    if (fileStatus === undefined) {
      setStatus(0);
    } else if (success) {
      setIsUploaded(true);
    } else {
      setStatus(fileStatus);
    }
  }, [fileStatus]);

  useEffect(() => {
    if (senderDetails && myUser && !isUploaded) {
      senderDetails.forEach((item, index) =>
        uploadFile(item.uri, item.name, index, item.name, item.type)
      );
    }
  }, [senderDetails]);

  return (
    <SafeAreaView style={styles.container}>
      {!isUploaded ? (
        <View>
          <View style={styles.lotiView}>
            <LottieView
              source={require("../../assets/cloudStorage.json")}
              autoPlay={true}
            />
          </View>
          <ProgressBar
            style={{ marginBottom: 10 }}
            progress={fileStatus}
            color={"#ce97b0"}
          />
        </View>
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity onPress={endSession}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>End Session</Text>
            </View>
          </TouchableOpacity>
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
      )}

      {!isUploaded ? (
        <View
          style={{
            width: "100%",
            backgroundColor: "#ffd9d9",
            height: Dimensions.get("window").height,
            borderRadius: 20,
          }}
        >
          <FlatList
            data={senderDetails}
            keyExtractor={(item, index) => "key" + index}
            renderItem={(itemData) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    height: Dimensions.get("window").height * 0.16,
                    width: "90%",
                    alignSelf: "center",
                    borderRadius: 7,
                    borderBottomWidth: 0,
                    padding: 7,
                    marginBottom: 5,
                    borderBottomColor: "#cccccc",
                    backgroundColor: "#ffffff",
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      maxWidth: Dimensions.get("window").width * 0.5,
                      padding: 5,
                    }}
                  >
                    <Text style={{ paddingBottom: 5 }}>
                      {itemData.item.name}
                    </Text>
                    <Text numberOfLines={2} style={{ fontSize: 15 }}>
                      {itemData.item.type}
                    </Text>
                    {/* {itemData.item.size<1000000?<Text>{itemData.item.size/8000}Kb</Text>:<Text>{itemData.item.size/100000}mb</Text>} */}
                  </View>
                  {itemData.item.type.includes("image") ||
                  itemData.item.type.includes("video") ? (
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: Dimensions.get("window").width * 0.2,
                          borderRadius: 10,
                          height: Dimensions.get("window").height * 0.13,
                          borderRadius: 0,
                          position: "relative",
                          alignSelf: "center",
                        }}
                        source={{ uri: itemData.item.uri }}
                      />
                    </View>
                  ) : itemData.item.type.includes("pdf") ? (
                    <View style={{ justifyContent: "center" }}>
                      <AntDesign name="pdffile1" size={60} color="#ff6259" />
                    </View>
                  ) : (
                    <View style={{ justifyContent: "center" }}>
                      <MaterialIcons
                        name="insert-drive-file"
                        size={60}
                        color="#0ca2ad"
                      />
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      ) : null}
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
  button: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "black",
    width: width * 0.5,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#ffffff",
  },
});

export default CSendFiles;
