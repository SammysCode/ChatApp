import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


function FriendrequestComp(props) {

    return (
        <View style={styles.container}>
            <Text style={styles.textperson}>{props.name}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deletebtn} onPress={() => props.decline(props.id)}>
                    <Text style={styles.textbtn1}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.openbtn} onPress={() => props.accept(props.id, props.acceptId, props.receiverId, props.acceptName, props.name)}>
                    <Text style={styles.textbtn2}>Add</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: "#ACACAC",
        borderBottomWidth: 1,
        marginTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textperson: {
        fontSize: 14,
        fontFamily: "Roboto",
        color: "black",
        fontWeight: "bold",
        paddingBottom: 8,
        paddingTop: 8,
        textAlignVertical: "center",
        marginBottom: 1,
    },
    buttonContainer: {
        flexDirection: "row",
    },
    deletebtn: {
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        marginBottom: 1,
    },
    textbtn1: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: "Roboto",
        fontStyle: "normal",
        color: "#344955",
        textTransform: "uppercase",
    },
    openbtn: {
        borderRadius: 4,
        backgroundColor: "#344955",
        height: 48,
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 1,
    },
    textbtn2: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: "Roboto",
        fontStyle: "normal",
        color: "white",
        textTransform: "uppercase",
    },
})

export default FriendrequestComp;