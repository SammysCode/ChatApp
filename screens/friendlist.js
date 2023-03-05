import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import FriendComp from "../components/friendcomp";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from '../firebase';

function FriendList(props) {

    const friendsRef = firestore.collection('users').doc(auth.currentUser.uid).collection('friends');
    const [friends] = useCollectionData(friendsRef, { idField: 'id' });
    // console.log(friends);
    const deleteFriend = (friendUid, currentId) => {
        firestore.collection('users').doc(auth.currentUser.uid).collection('friends').doc(friendUid).delete().then(() => console.log("deleted")).catch(err => console.error(err));
        firestore.collection('users').doc(friendUid).collection('friends').doc(currentId).delete().then(() => console.log("deleted")).catch(err => console.error(err));
    }

    return (
        <View style={styles.container}>
            <View style={styles.textview}>
                <Text style={styles.texttitle}>Friends</Text>
            </View>
            <SafeAreaView style={styles.safearea}>
                <ScrollView>
                    {friends && friends.map((item) => <FriendComp key={item.id} navigation={props.navigation} name={item.name} deleteFriend={deleteFriend} currentId={auth.currentUser.uid} friendId={item.id} />)}
                </ScrollView>
                <View >
                    <TouchableOpacity style={styles.btnFriendReq} onPress={() => props.navigation.navigate('FriendRequests')}>
                        <Text style={styles.friendReqTxt}>Friend Requests</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <StatusBar style='auto' />
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
    textview: {
        marginBottom: 32,
    },
    texttitle: {
        fontSize: 24,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: '#ACACAC'
    },
    safearea: {
        height: '90%',
        marginBottom: 32,
    },

    btnFriendReq: {
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        backgroundColor: "#344955",
        borderRadius: 4,
    },

    friendReqTxt: {
        fontSize: 14,
        lineHeight: 18,
        color: "white",
        textTransform: "uppercase",
    }
});

export default FriendList;