import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from '../firebase';

// Component used in privaterooms.js
function Room(props) {
  const openChatroom = () => {
    props.navigation.navigate(auth.currentUser === null ? "ChatroomAnon" : "Chatroom", {
      roomId: props.roomId,
      roomName: props.roomName,
      private: props.private,
    });
  };

  return (
    <View>
      <TouchableOpacity style={styles.room} onPress={openChatroom}>
        <Text style={styles.roomText}>{props.roomName}</Text>
        <Text style={styles.roomText}>({props.roomParticipants})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  room: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  roomText: {
    paddingBottom: 8,
    fontSize: 14,
    fontFamily: "Roboto",
    color: "black",
  },
});
export default Room;
