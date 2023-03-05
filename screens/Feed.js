import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  CheckBox,
  Picker,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import FeedComponent from "../components/FeedComponent";
import { auth } from "../firebase";
import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase";
import BigList from "react-native-big-list";

function Feed(props) {
  const [feeds, setFeeds] = useState([]);
  const [username, setUsername] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const isMountedRef1 = useRef(null);
  const isMountedRef2 = useRef(null);

  useEffect(() => {
    isMountedRef1.current = true;
    if (isMountedRef1.current) {
      fetchMessages();
    }
    return () => (isMountedRef1.current = false);
  }, [feeds]);

  useEffect(() => {
    isMountedRef2.current = true;
    if (isMountedRef2.current) {
      auth.currentUser === null ? () => {} : getProfileData();
    }
    return () => (isMountedRef2.current = false);
  }, [isPrivate, username, fetchedLikes]);

  const fetchMessages = () => {
    fetch(getLink())
      .then((res) => res.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    if (data) {
      const keys = Object.keys(data);
      const valueKeys = Object.values(data).map((item, index) =>
        Object.defineProperty(item, "id", { value: keys[index] })
      );
      setFeeds(valueKeys);
    }
  };

  if (feeds) {
    feeds.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
  }
  const [message, setMessage] = useState("");
  const uid = auth.currentUser === null ? null : auth.currentUser;
  const [isReply, setIsReply] = useState(false);
  const [replyDoc, setReplydoc] = useState("");
  const [replyMess, setReplyMess] = useState("");
  const [replyId, setReplyId] = useState("");
  const [replyName, setReplyName] = useState("");

  const [feedNr, setFeedNr] = useState(null);
  const [fetchedLikes, setFetchedLikes] = useState(null);
  const flatlistRef = useRef();

  const getLink = () => {
    if (props.route.params.private) {
      return `https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/privatechatrooms/${props.route.params.roomId}/messages.json`;
    } else {
      return `https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/publicchatrooms/${props.route.params.roomId}/messages.json`;
    }
  };

  const getProfileData = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setIsPrivate(documentSnapshot.get("privateUser"));
          setUsername(documentSnapshot.get("userName"));
          setFeedNr(documentSnapshot.get("numberOfFeeds"));
          setFetchedLikes(documentSnapshot.get("numberOfLikes"));
        }
      });
  };


    const updateFeeds = () => {
        auth.currentUser === null ? () => {} :firebase.firestore().collection('users').doc(uid.uid).update({"numberOfFeeds": feedNr + 1}).then(() => {}).catch(err => console.error(err));
    }

    const updateLikes = () => {
        setFetchedLikes(fetchedLikes + 1);
        auth.currentUser === null ? () => {} : firebase.firestore().collection('users').doc(uid.uid).update({"numberOfLikes": fetchedLikes + 1}).then(() => {}).catch(err => console.error(err));
    }
         

  const sendMessage = () => {
    if (message) {
      auth.currentUser === null ? () => {} : setFeedNr(feedNr + 1);
      if (isReply) {
        fetch(getLink(), {
          method: "POST",
          body: JSON.stringify({
            createdAt: Date.now(),
            likes: 0,
            reply: {
              id: replyId,
              name: replyName,
              message: replyMess,
              messageId: replyDoc,
            },
            roomid: props.route.params.roomId,
            sender: {
              id: auth.currentUser === null ? null : uid.uid,
              name: isPrivate ? username : "Private",
            },
            text: message,
          }),
        })
          .then((res) => fetchMessages())
          .catch((err) => console.error(err));
        updateFeeds();
      } else {
        fetch(getLink(), {
          method: "POST",
          body: JSON.stringify({
            createdAt: Date.now(),
            likes: 0,
            reply: "",
            roomid: props.route.params.roomId,
            sender: {
              id: auth.currentUser === null ? null : uid.uid,
              name: isPrivate ? username : "Private",
            },
            text: message,
          }),
        })
          .then((res) => {
            updateFeeds();
            fetchMessages();
          })
          .catch((err) => console.error(err));
        updateFeeds();
      }
      setMessage("");
      setIsReply(false);
    }
  };

  const chooseReply = (messid, repid, repname) => {
    setReplydoc(messid);
    feeds.forEach((item) => {
      if (item.id === messid) {
        setReplyMess(item.text);
      }
    });
    setReplyId(repid);
    setReplyName(repname);
    setIsReply(true);
  };

  const cancelReply = () => {
    setReplydoc("");
    setReplyMess("");
    setReplyId("");
    setReplyName("");
    setIsReply(false);
  };

  const scrollFunc = () => {
    if (typeof flatlistRef.current !== "undefined") {
      flatlistRef.current.scrollToEnd();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texttitle}>{props.route.params.roomName}</Text>

      <View style={styles.feedsArea}>
        <BigList
          ref={flatlistRef}
          onContentSizeChange={scrollFunc}
          data={feeds}
          keyExtractor={(item) => item.id}
          renderItem={(item) => (
            <FeedComponent
              navigation={props.navigation}
              updateLikes={updateLikes}
              private={props.route.params.private}
              fetchMessages={fetchMessages}
              roomId={props.route.params.roomId}
              chooseReply={chooseReply}
              id={item.item.id}
              text={{ id: item.item.sender.id, name: item.item.sender.name }}
              nameAnswer={
                item.item.reply.message ? item.item.reply.message : ""
              }
              answer={item.item.text}
              countBtn={item.item.likes}
            />
          )}
        />
        {/* <Button title = "show" onPress = {() => console.log(flatlistRef)} /> */}
      </View>

      {isReply ? (
        <View>
          <TouchableOpacity onPress={cancelReply}>
            <Text>{replyMess}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text></Text>
      )}

      <View style={styles.viewbottom}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendbtn} onPress={sendMessage}>
          <Text style={styles.sendbtntext}>&#10140;</Text>
        </TouchableOpacity>
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
  feedsArea: {
    marginTop: 32,
    marginBottom: 32,
    flex: 1,
    flexDirection: "column",
  },
  texttitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "#ACACAC",
    textAlign: "left",
  },
  viewbottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    color: "#ACACAC",
    fontSize: 14,
    lineHeight: 18,
    height: "100%",
    width: "80%",
    borderBottomWidth: 1,
    borderColor: "#ACACAC",
  },
  sendbtn: {
    height: 48,
    width: 48,
    backgroundColor: "#344955",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  sendbtntext: {
    fontSize: 14,
    color: "white",
  },
});
export default Feed;
