import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

//actions
import { fetchSenderFiles } from "../../store/actions/files";

//icons
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const CRecieveFiles = (props) => {
  const [initial, setInitial] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const sender_files = useSelector((state) => state.files.allFiles);
  const myUser = useSelector((state) => state.auth.users);
  const dispatch = useDispatch();
  // console.log(sender_files)

  useEffect(() => {
    const id = setInterval(fetchFiles, 8000);
  }, [initial]);

  const goToDownload = () => {
    props.navigation.dispatch(StackActions.replace("Download"));
  };

  const fetchFiles = async () => {
    await dispatch(fetchSenderFiles());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.lotiView}>
          <LottieView
            source={require("../../assets/files.json")}
            autoPlay={true}
            loop={
              sender_files === undefined || sender_files.length === 0
                ? true
                : false
            }
          />
        </View>
        {sender_files === undefined || sender_files.length === 0 ? null : (
          <TouchableOpacity onPress={goToDownload}>
            <LinearGradient
              start={{ x: 0, y: 0.85 }}
              end={{ x: 1.9, y: 0.25 }}
              // Button Linear Gradient
              colors={["#9f98e8", "#aff6cf"]}
              style={{
                padding: 12,
                alignItems: "center",
                borderRadius: 10,
                width: "80%",
                alignSelf: "center",
                marginVertical: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Proceed</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      {sender_files === undefined || sender_files.length === 0 ? null : (
        <View
          style={{
            width: "100%",
            backgroundColor: "#ffd9d9",
            height: Dimensions.get("window").height,
            borderRadius: 20,
          }}
        >
          {sender_files === undefined ? null : (
            <FlatList
              data={sender_files}
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
                        maxWidth: Dimensions.get("window").width * 0.7,
                        padding: 5,
                      }}
                    >
                      <Text style={{ paddingBottom: 5 }}>
                        {itemData.item.name}
                      </Text>
                      <Text numberOfLines={2} style={{ fontSize: 15 }}>
                        {itemData.item.type}
                      </Text>
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
                          source={{ uri: itemData.item.url }}
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
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  lotiView: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
});

export default CRecieveFiles;
