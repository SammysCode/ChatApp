import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/StartScreen';
import Registration from './screens/RegistrationScreen';
import CreateChatRoom from './screens/CreateChatRoom';
import ChatRoomSelection from './screens/ChatRoomSelection';
import Feed from './screens/Feed';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ChatList from './screens/Chatlist';
import FriendList from './screens/friendlist';
import PrivateChat from './screens/privatechat';
import ProfileScreen from './screens/ProfileScreen';
import EditProfile from './screens/EditProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FriendRequestList from './screens/friendrequests';
import { auth } from './firebase';
import * as SecureStore from "expo-secure-store";
import { CommonActions } from '@react-navigation/routers';


const Stack = createStackNavigator();
const Stack1 = createStackNavigator();
const Stack2 = createStackNavigator();
const Stack3 = createStackNavigator();
const Stack4 = createStackNavigator();
const Stack5 = createStackNavigator();
const BottomTabs = createMaterialBottomTabNavigator();

const LoginStack = ({ navigation }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    SecureStore
      .getItemAsync("userSession")
      .then(res => JSON.parse(res))
      .then(data => data !== null ? login(data.email, data.password) : setIsSignedIn(false))
      .catch(err => console.error(err))

    if (isSignedIn) {
    }
  }, [])

  const login = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Auto logged in with:", user.email);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'App' }]
          })
        );
      })
      .catch((err) => alert(err.message));
  }


  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
      <Stack.Screen name="ChatroomlistAnon" component={ChatRoomSelection} options={{ headerShown: false }} />
      <Stack.Screen name="ChatroomAnon" component={Feed} options={{ headerShown: false }} />
    </Stack.Navigator>);
}

const AppTabs = () => {
  return (
    <BottomTabs.Navigator barStyle={{ backgroundColor: '#344955' }}>
      <BottomTabs.Screen name="Chatlist" component={ChatroomList} options={{ tabBarLabel: 'Rooms', tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="forum" color={color} size={24} />) }} />
      <BottomTabs.Screen name="Messages" component={MessagesStack} options={{ tabBarLabel: 'Messages', tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="chat-processing" color={color} size={24} />) }} />
      <BottomTabs.Screen name="FriendList" component={FriendsStack} options={{ tabBarLabel: 'Friends', tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account-group" color={color} size={24} />) }} />
      <BottomTabs.Screen name="ProfileScreens" component={ProfileStack} options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account" color={color} size={24} />) }} />
    </BottomTabs.Navigator>);
}

const ChatroomList = () => {
  return (
    <Stack2.Navigator>
      <Stack2.Screen name="Chatroomlist" component={ChatRoomSelection} options={{ headerShown: false }} />
      <Stack2.Screen name="Chatroom" component={Feed} options={{ headerShown: false }} />
      <Stack2.Screen name="CreateChatRoom" component={CreateChatRoom} options={{ headerShown: false }} />
      <Stack2.Screen name="SomeProfile" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack2.Navigator>
  );
}

const MessagesStack = () => {
  return (
    <Stack3.Navigator initialRouteName="MessageList">
      <Stack3.Screen name="MessageList" component={ChatList} options={{ headerShown: false }} />
      <Stack3.Screen name="PrivateMessage" component={PrivateChat} options={{ headerShown: false }} />
    </Stack3.Navigator>
  );
}

const FriendsStack = () => {
  return (
    <Stack5.Navigator>
      <Stack5.Screen name="FirendList" component={FriendList} options={{ headerShown: false }} />
      <Stack5.Screen name="FriendRequests" component={FriendRequestList} options={{ headerShown: false }} />
      <Stack5.Screen name="FriendProfile" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack5.Navigator>
  );
}

const ProfileStack = () => {
  return (
    <Stack4.Navigator>
      <Stack4.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
    </Stack4.Navigator>
  );
}

const FirstStack = () => {



  return (
    <Stack1.Navigator>
      <Stack1.Screen name="Start" component={LoginStack} options={{ headerShown: false }} />
      <Stack1.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
    </Stack1.Navigator>
  );
}


export default function App({ navigation }) {

  return (
    <NavigationContainer >
      <FirstStack />
      <StatusBar />
    </NavigationContainer>
  );


}

