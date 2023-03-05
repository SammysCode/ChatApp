import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Picker,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../firebase";
import firebase from "firebase";
import { updatePassword } from "firebase/auth";
import { Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function EditProfileScreen({ navigation }) {
  const uid = auth.currentUser;
  const user = firebase.auth().currentUser;
  const currentUserID = uid.uid;
  const currentUserEmail = uid.email;

  const [isPrivate, setPrivate] = useState(false);
  // Variable for button switch
  const toggleSwitch = () => setPrivate((previousState) => !previousState);

  const [username, setUsername] = useState(
    !isPrivate ? "" + username : "Private!"
  );
  const [email, setEmail] = useState(currentUserEmail);
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [numberOfFeeds, setNumberOfFeed] = useState(0);
  const [numberOfLikes, setNumberOfLikes] = useState(0);
  const [earned, setEarned] = useState(0);
  //const isMountedRef = useRef(false);

  // Check if screen is clicked again
  let count = 0;

  // Edit profile function - update values in the db - executed after btn click
  const editProfile = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .update({
        privateUser: !isPrivate,
        userEmail: email,
        userName: username,
        country: country,
      })
      .then(() => {
        console.log("User updated!");
      });
    if (password) {
      uid
        .updatePassword(password)
        .then(() => console.log("success"))
        .catch((err) => console.error(err));
      setPassword("");
    }
  };
  // Level of the user update
  const levelUpdate = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .update({
        userLevel: userLevel,
      })
      .then(() => {
        console.log("Level updated!");
      });
  };

  //Getting data for selected user from the db - only once
  const getProfileData = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(currentUserID)
      .get()
      .then((documentSnapshot) => {
        console.log("User exists: ", documentSnapshot.exists);
        if (documentSnapshot.exists) {
          console.log("User data: ", documentSnapshot.data());
          setPrivate(!documentSnapshot.get("privateUser"));
          setUsername(documentSnapshot.get("userName"));
          setEmail(documentSnapshot.get("userEmail"));
          setPassword(documentSnapshot.get("userPassword"));
          setNumberOfLikes(documentSnapshot.get("numberOfLikes"));
          setNumberOfFeed(documentSnapshot.get("numberOfFeeds"));
          setUserLevel(documentSnapshot.get("userLevel"));
          setCountry(documentSnapshot.get("country"));
        }
      });
  };

  // Getting data for selected user from the db - listening permanently
  /* function getProfileData() {
    useEffect(() => {
      const subscriber = firebase.firestore()
        .collection('users')
        .doc(currentUserID)
        .onSnapshot(documentSnapshot => {
          console.log("User data: ", documentSnapshot.data());
          setPrivate(!documentSnapshot.get("privateUser"));
          setUsername(documentSnapshot.get("userName"));
          setEmail(documentSnapshot.get("userEmail"));
          setPassword(documentSnapshot.get("userPassword"));
          setNumberOfLikes(documentSnapshot.get("numberOfLikes"));
          setNumberOfFeed(documentSnapshot.get("numberOfFeeds"));
          setUserLevel(documentSnapshot.get("userLevel"));
          setCountry(documentSnapshot.get("country"));
        });
  
      // Stop listening for updates when no longer required
      return () => subscriber();
    });
  } */


  // When sign out or delete user, this will bring user back in the start screen
  const navigatingOut = () => {
    navigation.replace("Start");
    navigation.reset({
      index: 0,
      routes: [{ name: "Start" }],
    });
  };

  // Sign out fun
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        SecureStore.deleteItemAsync("userSession")
          .then((res) => console.log("success"))
          .catch((err) => console.error(err));
        navigatingOut();
        console.log("You are signed out! Active user:", auth.currentUser);
        navigatingOut();
      })
      .catch((err) => alert(err.message));
  };
  // Delete user fun
  const deleteUser = () => {
    user
      .delete()
      .then(function () {
        SecureStore.deleteItemAsync("userSession")
          .then((res) => console.log("success"))
          .catch((err) => console.error(err));
        console.log("User account was deleted!:", auth.currentUser);
        navigatingOut();
      })
      .catch(function (error) {
        // An error happened.
        alert(error.message);
      });
  };

  // Level selection based on likes
  const checkStatus = () => {
    if (numberOfLikes >= 0 && numberOfLikes < 5) {
      setUserLevel("Beginner!");
    } else if (numberOfLikes >= 5 && numberOfLikes < 10) {
      setUserLevel("Advanced!");
    } else if (numberOfLikes >= 10 && numberOfLikes < 20) {
      setUserLevel("Profesional!");
    } else if (numberOfLikes >= 20 && numberOfLikes < 30) {
      setUserLevel("Beast!");
    }
    console.log("Likes + Level" + numberOfLikes + " " + userLevel);
  };
  console.log(count);

  // Everytime we open the screen, we will update the data

  useEffect(() => {
    console.log("The screen is visible");

    getProfileData();
    checkStatus();
    setEarned((Number(numberOfLikes) / Number(numberOfFeeds)).toFixed(2));
    levelUpdate();
  }, []);
  //getProfileData();

  //   while (count == 0) {
  //   useEffect(() => {
  //     isMountedRef.current = true;
  //     if (isMountedRef.current) {
  //       checkStatus(numberOfLikes);
  //       getProfileData();
  //       setEarned((Number(numberOfFeeds) / Number(numberOfLikes)).toFixed(2));
  //       //levelUpdate(userLevel);
  //     }
  //     //  console.log(password);
  //     return () => (isMountedRef.current = false);
  //   }, [numberOfLikes,userLevel,earned]);
  //   count = 1;
  //   console.log(count);
  // }

  // Delete user alert dialog
  const deleteUserAlert = () =>
    Alert.alert(
      "Delete!",
      "Are you sure that you want to delete your account? This process cannot be undone !",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "DELETE",
          onPress: () => {
            deleteUser();
          },
        },
      ],
      { cancelable: false }
    );

  return (
    <View style={styles.container}>
      <View style={styles.commentLvlBox}>
        <Text style={styles.commentText}>{userLevel}</Text>
      </View>

      <View style={styles.statusView}>
        <View style={styles.statusViewInner}>
          <Text style={styles.numberStats}>{numberOfFeeds}</Text>
          <Text style={styles.textStats}>Posts</Text>
        </View>
        <View style={styles.statusViewInner}>
          <Text style={styles.numberStats}>{numberOfLikes}</Text>
          <Text style={styles.textStats}>Points</Text>
        </View>
        <View style={styles.statusViewInner}>
          <Text maxLength={3} style={styles.numberStats}>
            {earned === "NaN" ? 0 : earned}
          </Text>
          <Text style={styles.textStats}>Earned</Text>
        </View>
      </View>

      <View style={styles.editInputs}>
        <TextInput
          style={styles.inputsFields}
          placeholder={username}
          onChangeText={(text) => setUsername(text)}
          editable={!isPrivate}
          maxLength={25}
          value={!isPrivate ? username : "Private"}
        ></TextInput>

        <View style={styles.switchBtn}>
          <Text style={styles.switchText}> Anonymous mode </Text>
          <Switch
            trackColor={{ false: "#ACACAC", true: "black" }}
            thumbColor={isPrivate ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isPrivate}
          />
        </View>
        <TextInput
          style={styles.inputsFields}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        ></TextInput>
        <TextInput
          style={styles.inputsFields}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          value={password}
        ></TextInput>

        <View style={styles.pickerContainer}>
          <Text style={styles.textview}></Text>
          <Picker
            selectedValue={country}
            style={{
              color: "#ACACAC",
              height: "auto",
              width: "100%",
              fontSize: 14,
              fontFamily: "Roboto",
            }}
            onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
          >
            <Picker.Item
              style={styles.textview}
              label="Country"
              value="country"
            />

            <Picker.Item style={styles.textview} label="Finland" value="fi" />
            <Picker.Item style={styles.textview} label="Norway" value="nr" />
            <Picker.Item style={styles.textview} label="Slovakia" value="sk" />
            <Picker.Item style={styles.textview} label="Czechia" value="cz" />
            <Picker.Item style={styles.textview} label="Canada" value="ca" />
            <Picker.Item style={styles.textview} label="China" value="ch" />
            <Picker.Item style={styles.textview} label="Usa" value="us" />

            <Picker.Item
              style={styles.textview}
              label="Great Britain"
              value="gb"
            />

            <Picker.Item style={styles.textview} label="Sweden" value="sw" />
            <Picker.Item style={styles.textview} label="Moldava" value="ml" />
          </Picker>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <TouchableOpacity style={styles.btnLogOut} onPress={signOut}>
            <Text style={[styles.btnText, { color: "black" }]}>Log out</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.btnSave} onPress={editProfile}>
            <Text style={styles.btnText}>Save profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <TouchableOpacity style = {{borderColor: 'red', borderWidth: 1, width: '100%', height: 40}} onPress = {() => setTotalLikes(totalLikes + 1)}>
        <Text>Add like</Text>
      </TouchableOpacity> */}
      <View style={styles.deleteView}>
        <TouchableOpacity onPress={deleteUserAlert}>
          <View style={styles.deleteBtn}>
            <MaterialCommunityIcons
              name="delete-forever"
              size={36}
              color="#B31412"
            />
            <Text
              style={[
                styles.textBtn,
                {
                  color: "#B31412",
                },
              ]}
            >
              Delete acount
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 32,
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: "center",
    alignContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },

  commentLvlBox: {
    // paddingBottom: "10%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#CDCDCD",
    height: "10%",
    width: "100%",
    textAlignVertical: "center",
    borderRadius: 4,
  },
  commentText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },

  statusView: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusViewInner: {
    flexDirection: "column",
    alignContent: "space-around",
  },
  numberStats: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: "black",
  },

  textStats: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#ACACAC",
    textAlign: "center",
  },
  textBtn: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#344955",
    textTransform: "uppercase",
  },

  btnField: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    alignContent: "stretch",
  },

  editInputs: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    marginBottom: 32,
  },

  switchBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  switchText: {
    color: "#ACACAC",
  },

  inputsFields: {
    borderBottomWidth: 1,
    borderColor: "#ACACAC",
  },

  btnSave: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    backgroundColor: "#344955",
    borderRadius: 4,
  },
  btnLogOut: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    backgroundColor: "rgba(52, 73, 85, 0.3)",
    borderRadius: 4,
    borderColor: "black",
    borderWidth: 1,
  },
  btnText: {
    textTransform: "uppercase",
    fontSize: 14,
    color: "white",
    paddingLeft: 16,
    paddingRight: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteView: {
    paddingTop: 32,
    flexDirection: "column",
    alignSelf: "flex-start",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#ACACAC",
  },
  textview: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "normal",
    color: "#ACACAC",
  },
});

export default EditProfileScreen;
