import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import firebase from "firebase";
import { auth } from '../firebase';

function ProfileScreen(props) {
  
  
  const[level, setLevel] = useState(null);
  const[username, setUsername] = useState(null);
  const[feedNr, setFeedNr] = useState(null);
  const[fetchedLikes, setFetchedLikes] = useState(null);
  const[currentName, setCurrentName] = useState(null);
  
  const getProfileData = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setLevel(documentSnapshot.get('userLevel'));
          setUsername(documentSnapshot.get("userName"));
          setFeedNr(documentSnapshot.get('numberOfFeeds'));
          setFetchedLikes(documentSnapshot.get('numberOfLikes'));
        }
    });
  }

  const setCurrent = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          
          setCurrentName(documentSnapshot.get('userName'));
        }
    });
  }

  useEffect(() => {
    getProfileData();
    setCurrent();
  }, []);
  

  const sendFriendRequest = () => {
    firebase.firestore().collection('users').doc(props.route.params.uid).collection('friendRequests').add({uid: auth.currentUser.uid, name: currentName});
    props.navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileBlock}>
        <View>
          <Text style={styles.nicknameTxt}>{username}</Text>
        </View>
        <View style={styles.commenterView}>
          <Text style={styles.commenterTxt}>{level}</Text>
        </View>
        <View style={styles.statusView}>
          <View style={styles.statusViewInner}>
            <Text style={styles.numberStats}>{feedNr}</Text>
            <Text style={styles.textStats}>Posts</Text>
          </View>
          <View style={styles.statusViewInner}>
            <Text style={styles.numberStats}>{fetchedLikes}</Text>
            <Text style={styles.textStats}>Earned</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonArea}>
        {props.route.params.friends ?
        <Text></Text>:
          <TouchableOpacity style={styles.btnAddFriend} onPress = {sendFriendRequest}>
            <Text style={styles.btnText}>Add friend</Text>
          </TouchableOpacity>
        }
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingTop: 64,
    paddingBottom: 32,
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: "center",
    justifyContent: "space-evenly",
  },
  profileBlock: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  nicknameTxt: {
    paddingBottom: 32,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto",
    textAlign: "center",
  },

  commenterView: {
    paddingTop: 64,
    paddingBottom: 64,
    backgroundColor: "rgba(52, 73, 85, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    textAlignVertical: "center",
    borderRadius: 4,
  },
  commenterTxt: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto",
    textAlign: "center",
  },
  statusView: {
    width: "100%",
    paddingTop: 32,
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
  buttonArea: {
    justifyContent: "flex-end",
  },
  btnAddFriend: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    backgroundColor: "#344955",
    borderRadius: 4,
  },
  btnText: {
    textTransform: "uppercase",
    fontSize: 14,
    color: "white",
  },

});

export default ProfileScreen;
