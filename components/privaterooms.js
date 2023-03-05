import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, FlatList, Text, View } from "react-native";
import { auth, firestore } from "../firebase";
import Room from "./Room";
import { useCollectionData } from "react-firebase-hooks/firestore";

function PrivateRooms(props) {
  const [chatrooms, setChatrooms] = useState([]);
  const[profileData,setProfileData] = useState(null);
  const isMountedRef = useRef(null);

  if (chatrooms) {
    chatrooms.sort(function (a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  useEffect(() => {
    isMountedRef.current = true;
    if(isMountedRef.current) {
      fetchRooms();
    }

    return () => isMountedRef.current = false;
  }, [chatrooms]);

  const fetchRooms = () => {
    fetch(
      "https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/privatechatrooms/.json"
    )
      .then((res) => res.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setChatrooms(valueKeys);
  };

  useEffect(() => {
    firestore.collection('users').doc(auth.currentUser.uid).get().then(res => setProfileData(res.data())).catch(err => console.error(err));
  }, []);
  
  return (
    <FlatList
      style={styles.filteredArea}
      data={chatrooms}
      keyExtractor={(item) => item.id}
      renderItem={(item) =>
        profileData ? (item.item.country == profileData.country ? (
          <Room
            private={true}
            roomName={item.item.name}
            roomId={item.item.id}
            navigation={props.navigation}
          />
        ) : (
          <View></View>
        )) : <View></View>
      }
    />
  );
}

const styles = StyleSheet.create({
  filteredArea: {
    height: "100%",
    flexDirection: "column",
    marginBottom: 32,
  },
  borderArea: {
    borderBottomWidth: 1,
    borderColor: "#ACACAC",
    width: "80%",
    alignSelf: "center",
    paddingTop: 16,
  },
  letterFiltered: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#ACACAC",
    textAlign: "left",
    paddingBottom: 8,
  },
});
export default PrivateRooms;
