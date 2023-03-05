import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  CheckBox,
  Picker,
  TouchableOpacity,
} from "react-native";
import { firestore } from "../firebase";

function CreateChatRoom(props) {
  const [isSelected, setSelection] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Country");
  const [chatroomName, setChatroomName] = useState("");

  const chatroomRef = firestore.collection("chatrooms");

  const createChatroom = (e) => {
    if (chatroomName) {

      if (isSelected) {
        fetch(
          `https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/privatechatrooms/.json`,
          {
            method: "POST",
            body: JSON.stringify({
              name: chatroomName,
              private: isSelected,
              country: selectedValue,
            }),
          }
        )
          .then((res) => {
            setChatroomName("");
            setSelection(false);
            setSelectedValue("Country");
            props.navigation.goBack();
          })
          .catch((err) => console.error(err));
      } else {
        fetch(
          `https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/publicchatrooms/.json`,
          {
            method: "POST",
            body: JSON.stringify({
              name: chatroomName,
              private: isSelected,
              country: selectedValue,
            }),
          }
        )
          .then((res) => {
            setChatroomName("");
            setSelection(false);
            setSelectedValue("Country");
            props.navigation.goBack();
          })
          .catch((err) => console.error(err));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerArea}>
        <Text style={styles.texttitle}>Create chat room</Text>

        <View style={styles.inputFirst}>
          <TextInput
            style={styles.textview}
            placeholder="Create a chat room"
            placeholderTextColor="#ACACAC"
            onChangeText={(text) => setChatroomName(text)}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>
            {isSelected ? "Room is private" : "Room is not private"}{" "}
          </Text>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
          />
        </View>

        <View style={styles.inputLast}>
          {isSelected ? (
            <View style={styles.pickerContainer}>
              <Text style={styles.textview}></Text>
              <Picker
                selectedValue={selectedValue}
                style={{
                  color: "#ACACAC",
                  height: "auto",
                  width: "100%",
                  fontSize: 14,
                  fontFamily: "Roboto",
                }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedValue(itemValue)
                }
              >
                <Picker.Item
                  style={styles.textview}
                  label="Country"
                  value="country"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Finland"
                  value="fi"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Norway"
                  value="nr"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Slovakia"
                  value="sk"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Czechia"
                  value="cz"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Canada"
                  value="ca"
                />
                <Picker.Item style={styles.textview} label="China" value="ch" />
                <Picker.Item style={styles.textview} label="Usa" value="us" />
                <Picker.Item
                  style={styles.textview}
                  label="Great Britain"
                  value="gb"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Sweden"
                  value="sw"
                />
                <Picker.Item
                  style={styles.textview}
                  label="Moldava"
                  value="ml"
                />
              </Picker>
            </View>
          ) : (
            <View></View>
          )}
        </View>

        <View style={styles.lastbtnview}>
          <TouchableOpacity style={styles.lastbtn} onPress={createChatroom}>
            <Text style={styles.lastbtntext}>Create!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: "center",
    alignContent: "center",
  },
  centerArea: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  inputFirst: {
    paddingTop: 32,
    paddingBottom: 8,
  },
  inputLast: {
    paddingTop: 8,
    paddingBottom: 32,
  },

  textview: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "normal",
    color: "#ACACAC",
  },
  texttitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ACACAC",
    textAlign: "center",
  },

  checkboxContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "normal",
    color: "#ACACAC",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#ACACAC",
  },
  lastbtnview: {
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    height: 36,
    justifyContent: "center",
  },
  lastbtn: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#344955",
    borderRadius: 4,
  },
  lastbtntext: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "white",
    textTransform: "uppercase",
  },
});
export default CreateChatRoom;
