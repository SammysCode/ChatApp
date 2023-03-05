import React, { createRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Picker,
} from "react-native";
import { auth, firestore } from "../firebase";
import {
  doc,
  setDoc,
  getDocs,
  where,
  query,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Registration({ navigation }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [psswrd, setPsswrd] = useState("");
  const [confirmPsswrd, setConfirmPsswrd] = useState("");
  const [country, setCountry] = useState("");
  const [allUserNames, setAllUserNames] = useState([]);


  const ref = firestore.collection('users');
  const query = ref.where('userName', '==', userName);
  const [userNamArr] = useCollectionData(query, { idField: 'id' });

  // HAndles the registration
  const handleRegistration = () => {
    // Checks if there is the same user name, if 0 it continues to check the retyped password is the same
    if (userNamArr.length === 0) {
      if (psswrd === confirmPsswrd) {
        // Creates the user with email and password 
        auth
          .createUserWithEmailAndPassword(email, psswrd)
          .then((userCredentials) => {
            const user = userCredentials.user;
            console.log(user.email);

            // Creates new document with user ID and stores the data of the registered user
            firestore.collection("users").doc(user.uid).set({
              numberOfFeeds: 0,
              numberOfLikes: 0,
              privateUser: true,
              userEmail: email,
              userName: userName,
              country: country,
              userLevel: "",
            });
          })
          .then(() => {
            navigation.goBack();
          })
          .catch((err) => alert(err.message));
      } else {
        alert("Password did not match");
      }
    } else {
      alert("Username taken u idiot. Choose another one you retard");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.regHeader}>
        <Text style={styles.headerText}>Registration</Text>
      </View>
      <View style={styles.regForm}>
        <TextInput
          style={styles.inputFields}
          value={email}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.replace(/ /g, ""))}
          placeholder="Email"
          keyboardType={"email-address"}
        ></TextInput>
        <TextInput
          style={styles.inputFields}
          placeholder="Username"
          value={userName}
          onChangeText={(text) => setUserName(text.replace(/ /g, ""))}
        ></TextInput>
        <TextInput
          style={styles.inputFields}
          value={psswrd}
          onChangeText={(text) => setPsswrd(text.replace(/ /g, ""))}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry
        ></TextInput>
        <TextInput
          style={styles.inputFields}
          placeholder="Re-Password"
          value={confirmPsswrd}
          onChangeText={(text) => setConfirmPsswrd(text.replace(/ /g, ""))}
          autoCapitalize="none"
          secureTextEntry
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
        <TouchableOpacity style={styles.regBtn} onPress={handleRegistration}>
          <Text style={styles.btntext}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 64,
    marginTop: 40,
    // borderWidth: 1,
    // borderColor: "black",
  },
  regHeader: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ACACAC",
  },

  regForm: {
    paddingLeft: "10%",
    paddingRight: "10%",
    flex: 2,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    alignItems: "center",
  },
  inputFields: {
    fontSize: 14,
    borderColor: "#ACACAC",
    borderBottomWidth: 1,
    alignSelf: "stretch",
  },
  regBtn: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 286,
    backgroundColor: "#344955",
    opacity: 100,
    borderRadius: 4,
  },
  btntext: {
    color: "white",
    textTransform: "uppercase",
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

export default Registration;
