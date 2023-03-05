// import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { createRef, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { auth } from "../firebase";
import firebase from "firebase";
import * as SecureStore from "expo-secure-store";


function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [psswrd, setPsswrd] = useState("");
  // For auto log in, storing usersession in secure storage
  async function save(key, value) {

    const res = await SecureStore.setItemAsync(key, value);
    console.log(res);

  }
  // Checks the log in details 
  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, psswrd)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("logged in with:", user.email);

        save("userSession", JSON.stringify({
          email: email,
          password: psswrd,
          signIn: true,

        }))

        // Resets the navigation path
        navigation.reset({
          index: 0,
          routes: [{ name: "App" }],
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Let's chat!</Text>
      </View>

      <View style={styles.loginForm}>
        <Text style={styles.formText}>Sign in</Text>
        <TextInput
          style={styles.inputFields}
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.replace(/ /g, ""))}
          keyboardType={"email-address"}
        ></TextInput>
        <TextInput
          style={styles.inputFields}
          value={psswrd}
          onChangeText={(text) => setPsswrd(text.replace(/ /g, ""))}
          placeholder="Password"
          secureTextEntry
        ></TextInput>
      </View>

      <View style={styles.btnStart}>
        <TouchableOpacity style={styles.btnSignIn} onPress={handleLogin}>
          <Text style={styles.btnTextW}>sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnReg}
          onPress={() => navigation.navigate("Registration")}
        >
          <Text style={styles.btnTextB}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity
          style={styles.btnReg}
          onPress={() => navigation.navigate("ChatroomlistAnon")}
        >
          <Text style={styles.btnTextB}>Join a chatroom</Text>
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
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
  },

  headerText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "black",
  },
  loginForm: {
    paddingLeft: "10%",
    paddingRight: "10%",
    flex: 2,
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    alignItems: "center",
  },
  formText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ACACAC",
  },
  inputFields: {
    fontSize: 14,
    borderColor: "#ACACAC",
    borderBottomWidth: 1,
    alignSelf: "stretch",
    padding: "5%",
  },
  btnStart: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  btnSignIn: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    width: 286,
    backgroundColor: "#344955",
    opacity: 100,
    borderRadius: 4,
  },
  btnTextW: {
    color: "white",
    textTransform: "uppercase",
  },
  btnReg: {
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 36,
    width: 286,
    backgroundColor: "#00000030",
    color: "#344955",
    borderRadius: 4,
  },
  btnTextB: {
    color: "black",
    textTransform: "uppercase",
  },
  orText: {},
});

export default Login;
