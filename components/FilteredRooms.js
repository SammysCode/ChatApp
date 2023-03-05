import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, FlatList } from "react-native";
import Room from "./Room";

// Component used in ChatRoomSelection
function FilteredRooms(props) {
  const [chatrooms, setChatrooms] = useState([]);
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    if(isMountedRef.current) {
      fetchRooms();
    }
    return () => isMountedRef.current = false;
  }, [chatrooms]);

  const fetchRooms = () => {
    fetch(
      "https://chatapp-a1d56-default-rtdb.europe-west1.firebasedatabase.app/publicchatrooms/.json"
    )
      .then((res) => res.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setChatrooms(valueKeys);
  };

  return (
    <FlatList
      style={styles.filteredArea}
      data={chatrooms}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <Room
          private={false}
          roomName={item.item.name}
          roomId={item.item.id}
          navigation={props.navigation}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  filteredArea: {
    height: "100%",
    flexDirection: "column",
    marginBottom: 32,
  },
  borderArea: {
    borderBottomWidth: 1,
    borderColor: "#ACACAC",
    width: "80%",
    alignSelf: "center",
    paddingTop: 16,
  },
  letterFiltered: {
    fontSize: 14,
    fontFamily: "Roboto",
    color: "#ACACAC",
    textAlign: "left",
    paddingBottom: 8,
  },
});
export default FilteredRooms;
