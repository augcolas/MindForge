import React, { useState } from "react";
import { Button, TextInput, View, Modal, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useWebSocket } from "../context/socket.context";
import { homeStyles } from "../styles/HomeStyles";
import logo from '../assets/Logo.png';

export default function Home({ navigation }: any) {
  const { createRoom, joinRoom } = useWebSocket();
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [showInputJoin, setShowInputJoin] = useState(false);
  const [showInputCreate, setShowInputCreate] = useState(false);
  const [showInputCode, setInputCode] = useState(false);


  const onCreateRoom = () => {
    createRoom(playerName).then((room) => {
      navigation.navigate("WaitingRoom",{
        playerName: playerName
      });
    });
  };

  const onJoinRoom = () => {
    joinRoom(roomId, playerName).then(() => {
      navigation.navigate("WaitingRoom",{
        playerName: playerName
      });
    });
  };

  const renderPlayerNameModal = () => (
    <Modal
      transparent={true}
      visible={showInputCreate}
      onRequestClose={() => {
        setShowInputCreate(false);
        setShowInputJoin(false);
      }}
    >
      <View style={homeStyles.modalContainer} >
        <View style={homeStyles.modalContent}>
        <TouchableOpacity
            onPress={() => setShowInputCreate(false)}
            style={homeStyles.closeButton}
          >
            <Text style={homeStyles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={homeStyles.modalTitle}>Enter Player Name</Text>
          <TextInput
            placeholder="Player Name"
            value={playerName}
            onChangeText={setPlayerName}
            style={homeStyles.modalInput}
          />
          <TouchableOpacity
            onPress={() => {
              setShowInputCreate(false);
              onCreateRoom();
            }}
            style={homeStyles.modalButton}
          >
            <Text style={homeStyles.modalButtonText}>
              {showInputCreate ? "Create Room" : "Join Room"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );


  const renderJoinRoomModal = () => (
    <Modal
      transparent={true}
      visible={showInputJoin}
      onRequestClose={() => {
        setShowInputCreate(false);
        setShowInputJoin(false);
      }}
    >
      <View style={homeStyles.modalContainer}>
        <View style={homeStyles.modalContent}>
          <TouchableOpacity
            onPress={() => setShowInputJoin(false)}
            style={homeStyles.closeButton}
          >
            <Text style={homeStyles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={homeStyles.modalTitle}>Enter code</Text>
          <TextInput
            value={roomId}
            placeholder="Code"
            onChangeText={setRoomId}
            style={homeStyles.modalInput}
          />
          <Text style={homeStyles.modalTitle}>Enter PlayerName</Text>
          <TextInput
            value={playerName}
            placeholder="Name"
            onChangeText={setPlayerName}
            style={homeStyles.modalInput}
          />
          <TouchableOpacity
            onPress={() => {
              setShowInputJoin(false);
              onJoinRoom();
            }}
            style={homeStyles.modalButton}
          >
            <Text style={homeStyles.modalButtonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  


  return (
    <LinearGradient
      colors={["rgba(27,109,22,1)", "rgba(23,52,18,1)"]}
      style={homeStyles.background}
    >
      {renderPlayerNameModal()}
      {renderJoinRoomModal()}

      <View style={homeStyles.logoContainer}>
        <Image source={logo} style={homeStyles.logo}></Image>
      </View>

      <View style={homeStyles.buttonContainer}>
        <Button
          title="Create Room"
          onPress={() => setShowInputCreate(true)}
          color="red"
        />
      </View>

      <View style={homeStyles.buttonContainer}>
        <Button
          title="Join Room"
          onPress={() => setShowInputJoin(true)}
          color="black"
        />
      </View>
    </LinearGradient>
  );
}
