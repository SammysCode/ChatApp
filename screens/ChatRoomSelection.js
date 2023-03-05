import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FilteredRooms from "../components/FilteredRooms";
import PrivateRooms from "../components/privaterooms";
import { auth } from '../firebase';

function ChatRoomSelection({ navigation }) {
  const [searchCrit, setSearchCrit] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.texttitle}>Chat rooms</Text>
      <View style={styles.roomsArea}>
        <Text style={styles.roomtypestext}>Public rooms</Text>
        <FilteredRooms navigation={navigation} searchText={searchCrit} />
        {auth.currentUser === null ? <Text></Text> : <Text style={styles.roomtypestext}>Private rooms</Text>}
        {auth.currentUser === null ? <Text></Text> : <PrivateRooms navigation={navigation} />}
      </View>
        {auth.currentUser === null ? <Text></Text> : <TouchableOpacity
          style={styles.createbtn}
          onPress={() => navigation.navigate("CreateChatRoom")}
        >
          <Text style={styles.btnText}>Create a chatroom</Text>
        </TouchableOpacity>}
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
    alignContent: "center",
  },
  roomsArea: {
    flex: 1,
    marginTop: 32,
    flexDirection: "column",
  },
  roomtypestext: {
    fontSize: 14,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ACACAC",
    textAlign: "left",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ACACAC",
  },
  texttitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ACACAC",
    textAlign: "left",
    paddingBottom: 32,
  },
  viewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    color: "#ACACAC",
    fontSize: 14,
    lineHeight: 18,
    height: "100%",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#ACACAC",
  },
  createbtn: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#344955",
    borderRadius: 4,
  },
  btnText: {
    textTransform: "uppercase",
    fontSize: 14,
    color: "white",
  },
});
export default ChatRoomSelection;
