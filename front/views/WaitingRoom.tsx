import { Button, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useWebSocket } from "../context/socket.context";
import { useEffect, useState } from "react";
import { waitingRoomStyles } from '../styles/WaitingRoomStyles';
import { commonStyles } from '../styles/CommonStyles';
import logo from '../assets/Logo.png';
import React from "react";

export default function WaitingRoom({ route, navigation }: any) {
    const { getRoom, socket } = useWebSocket();
    const [room, setRoom] = useState(getRoom());
    const [myself, setMyself] = useState(route.params.playerName);

    useEffect(() => {
        socket.on("room-status", (data) => {
            setRoom(data);
        });
        socket.on("game-started", () => {
            navigation.navigate("Game");
        });
    }, []);

    const renderPlayer = (player: any) => (
        <Text key={player.socketId} style={waitingRoomStyles.playerText}>
            {player.name}
        </Text>
    );

    const onStartGame = () => {
        socket.emit("start-game");
    }

    const onQuitRoom = () => {
        socket.emit("leave-room");
        navigation.navigate("Home");
    }

    return (
        <LinearGradient
            colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
            style={waitingRoomStyles.background}
        >
            <View style={waitingRoomStyles.logoContainer}>
                <Image source={logo} style={waitingRoomStyles.logo}></Image>
            </View>
            <Text style={waitingRoomStyles.roomCodeText}>{room.code}</Text>

            <View style={waitingRoomStyles.contentContainer}>
                <View style={waitingRoomStyles.leftContainer}>
                    <Text style={[waitingRoomStyles.text, waitingRoomStyles.centerText]}>Players in room:</Text>
                    <View style={waitingRoomStyles.playersRectangle}>
                        <Text style={waitingRoomStyles.playerText}>{room.owned.name}</Text>
                        {room.players.map((player) => {
                            if (player.socketId !== room.owned.socketId) {
                                return renderPlayer(player);
                            }
                        })}
                    </View>
                </View>

                <View style={waitingRoomStyles.rightContainer}>
                    {room.owned.name === myself &&
                      <TouchableOpacity
                        onPress={onStartGame}
                        style={commonStyles.primaryButton}
                      >
                          <Text style={commonStyles.primaryButtonText}>Start game</Text>
                      </TouchableOpacity>
                    }
                    <View style={waitingRoomStyles.spacesButton}></View>
                    <TouchableOpacity
                        onPress={onQuitRoom}
                        style={commonStyles.secondaryButton}
                    >
                        <Text style={commonStyles.secondaryButtonText}>Leave room</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}
