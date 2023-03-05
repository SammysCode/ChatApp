import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { auth, firestore } from '../firebase';


function MessageListTemplate(props) {
    const[roomData, setRoomData] = useState(null);


    const getRoomId = () => {
        firestore.collection('users').doc(auth.currentUser.uid).collection('friends').doc(props.friendId).get().then((doc) => {if(doc.exists) {setRoomData(doc.data())} else {console.error("no such document")}}).catch(err => console.error(err));
    }
    
    
    useEffect(() => {
        getRoomId();
    }, []);

    
    return (
        <View style = {styles.viewmessage}>
            <TouchableOpacity style = {styles.chatbtn} onPress = {() => props.navigation.navigate('PrivateMessage', { name: props.friendName, friendId: props.friendId, roomData: roomData})}>
                <Text style = {styles.textperson}>{props.friendName}</Text>
            </TouchableOpacity>
        </View>
        
    );
}

const styles = StyleSheet.create({
    viewmessage: {
        borderColor: '#ACACAC',
        borderBottomWidth: 1,
        marginTop: 16,
    },
    textperson: {
        fontSize: 14,
        fontFamily: 'Roboto',
        color: '#ACACAC',
    },
    chatbtn: {
        paddingBottom: 8,
    },
});

export default MessageListTemplate;