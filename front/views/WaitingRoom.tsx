import { Button, Text, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWebSocket } from "../context/socket.context";
import { useEffect, useState } from "react";
import { waitingRoomStyles } from '../styles/WaitingRoomStyles';
import logo from '../assets/Logo.png';
import React from "react";

export default function WaitingRoom() {
    const { getRoom, socket } = useWebSocket();
    const [room, setRoom] = useState(getRoom());

    useEffect(() => {
        socket.on("room-status", (data) => {
            setRoom(data);
        });
    }, []);

    const renderPlayer = (player: any) => (
        <Text key={player.socketId} style={waitingRoomStyles.playerText}>
            {player.name}
        </Text>
    );

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
                    <Text style={[waitingRoomStyles.text, waitingRoomStyles.centerText]}>Owner</Text>
                    <View style={waitingRoomStyles.ownerRectangle}>
                        <Text style={waitingRoomStyles.ownerText}>{room.owned.name}</Text>
                    </View>

                    {room.players.length > 1 && (
                        <>
                            <Text style={[waitingRoomStyles.text, waitingRoomStyles.centerText]}>Players in room:</Text>
                            <View style={waitingRoomStyles.playersRectangle}>
                                {room.players.map((player) => {
                                    if (player.socketId !== room.owned.socketId) {
                                        return renderPlayer(player);
                                    }
                                })}
                            </View>
                        </>
                    )}
                </View>

                <View style={waitingRoomStyles.rightContainer}>
                    <Button title={"Start game"} color='red'></Button>
                    <View style={waitingRoomStyles.spacesButton}></View>
                    <Button title={"Quit room"} color='black'></Button>
                </View>
            </View>
        </LinearGradient>
    );
}
