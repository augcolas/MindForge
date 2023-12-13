import { Button, StyleSheet, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useWebSocket } from "../context/socket.context";
import React, { useState } from "react";

export default function Home({ navigation }: any) {
  const { createRoom, joinRoom } = useWebSocket();
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [showInputJoin, setShowInputJoin] = useState(false);
  const [showInputCreate, setShowInputCreate] = useState(false);

  const onCreateRoom = () => {
    createRoom(playerName).then((room) => {
      navigation.navigate("WaitingRoom");
    });
  };


  const onJoinRoom = () => {
    joinRoom(roomId, playerName).then(() => {
      navigation.navigate("WaitingRoom");
    });
  };

  return (
    <LinearGradient
      colors={["rgba(27,109,22,1)", "rgba(23,52,18,1)"]}
      style={styles.background}
    >
      <Button title="Create Room" onPress={() => setShowInputCreate(true)} />
      {showInputCreate && (
        <View>
          <TextInput
            placeholder="Enter player name"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <Button title="Create" onPress={() => onCreateRoom()} />
        </View>
      )}
      <Button title="Join Room" onPress={() => setShowInputJoin(true)} />
      {showInputJoin && (
        <View>
          <TextInput
            placeholder="Enter room code"
            value={roomId}
            onChangeText={setRoomId}
          />
          <TextInput
            placeholder="Enter player name"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <Button title="Join" onPress={() => onJoinRoom()} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: "100%",
  },
});
