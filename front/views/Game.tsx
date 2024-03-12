import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { LinearGradient } from "expo-linear-gradient";
import { useWebSocket } from "../context/socket.context";
import { Card } from "../models/card";
import { CardImage } from "../components/Card";


export default function Game({route}:any) {
    const [orientation, setOrientation] = useState(1);
    const {socket} = useWebSocket();
    const [myself, setMyself] = useState(route.params.playerName);
    const [hand, setHand] = useState<Card[]>([]);
    const [flop, setFlop] = useState<Card[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [playing, setPlaying] = useState<string>("");

    useEffect(() => {
        socket.on("receive-card", (received:any) => {
            console.log("received: ",received)

            switch (received.ev) {
                case "FLOP":
                    setFlop(received.cards);
                    break;
                case "OWN_CARDS":
                    setHand(received.cards);
                    break;
                default:
                    break;
            }

        });

        socket.on("game-status", (received: any) => {
            console.log("game-status: ", received);
            setPlaying(received.playing.name);
        });
    }, []);


    useEffect(() => {
        lockOrientation().then(r => {});
    }, []);

    const lockOrientation = async () => {
        //if device is not computer
        if (Platform.OS === "web") return;
        await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
        );
        const o = await ScreenOrientation.getOrientationAsync();
        setOrientation(o);
    };


    return (
        <LinearGradient colors={["rgba(27,109,22,1)", "rgba(23,52,18,1)"]} style={styles.background}>
            <View style={styles.container}>

                <View style={styles.cards}>
                    {flop.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card} />
                    ))}
                </View>

                <View style={styles.ownCard}>
                    {hand.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card} />
                    ))}
                </View>

                <View style={styles.enemyCard1}>
                    <CardImage card={"back"} style={styles.card} />
                    <CardImage card={"back"} style={styles.card} />
                </View>

                <View style={styles.enemyCard2}>
                    <CardImage card={"back"} style={styles.card} />
                    <CardImage card={"back"} style={styles.card} />
                </View>

                <View style={styles.enemyCard3}>
                    <CardImage card={"back"} style={styles.card} />
                    <CardImage card={"back"} style={styles.card} />
                </View>

                <View>
                    <Text style={styles.info}>{playing === myself ? "Your turn" : "Waiting" }</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        position: 'relative',
        width: '90%',
        height: '90%',
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 5,
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    cards: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    card: {
        width: 80,
        height: 120
    },
    ownCard: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto',
        top: '80%'
    },
    enemyCard1: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        bottom: '80%',
        margin: 'auto',
    },
    enemyCard2: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '90deg'}],
        margin: 'auto',
        right: '80%',
    },
    enemyCard3: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '90deg'}],
        margin: 'auto',
        left: '80%',
    },
    tokens: {
        position: "absolute",
        height: '100%',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
    },
    token: {
        width: 50,
        height: 50
    },
    info: {
        display: 'flex',
        bottom: 180,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 5,
        padding: 10,
    }
});
