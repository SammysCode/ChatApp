import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../firebase";
import FriendrequestComp from "../components/friendrequestcomp";
import firebase from "firebase";




function FriendRequestList(props) {
    const friendrequestsRef = firestore.collection('users').doc(auth.currentUser.uid).collection('friendRequests');
    const [friendrequests] = useCollectionData(friendrequestsRef, { idField: 'id' });
    const [username, setUsername] = useState(null);
    const [roomid, setRoomid] = useState(null);

    const getUsername = () => {
        firebase
            .firestore()
            .collection("users")
            .doc(auth.currentUser.uid)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUsername(documentSnapshot.get("userName"));
                }
            });
    };
    useEffect(() => {
        getUsername();
    }, []);
    


    const declineRequest = (id) => {
        firestore.collection('users').doc(auth.currentUser.uid).collection('friendRequests').doc(id).delete().then(() => console.log("deleted")).catch(err => console.error(err));
    }

    const acceptRequest = (id, accepterId, receiverId, accepterName, receiverName) => {
        fetch('https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/privaterooms/.json', {
            method: 'POST',
            body: JSON.stringify({
                messages: {}
            })
        })
            .then(res => res.json())
            .then(data => {
                firestore.collection('users').doc(accepterId).collection('friends').doc(receiverId).set({ name: receiverName, roomid: data.name });
                firestore.collection('users').doc(receiverId).collection('friends').doc(accepterId).set({ name: accepterName, roomid: data.name });
                declineRequest(id);
            })
            .catch(err => console.error(err));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTxt}>Friend Requests</Text>
            {friendrequests && friendrequests.map(item => <FriendrequestComp key={item.id} name={item.name} id={item.id} receiverId={item.uid} acceptId={auth.currentUser.uid} acceptName={username} accept={acceptRequest} decline={declineRequest} />)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 64,
        marginBottom: 32,
        marginLeft: 32,
        marginRight: 32,
        flex: 1,
    },
    headerTxt: {
        fontSize: 24,
        lineHeight: 28,
        color: "#ACACAC",
        marginBottom: 16,
        fontWeight: "bold",


    },
})

export default FriendRequestList;