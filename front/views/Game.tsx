import { Button, Platform, StyleSheet, Text, View } from "react-native";
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
    const [turn, setTurn] = useState<Card[]>([]);
    const [river, setRiver] = useState<Card[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [enemyPLayers, setEnemyPlayers] = useState<any[]>([]);
    const [playing, setPlaying] = useState<boolean>(false);

    useEffect(() => {
        lockOrientation().then(r => {});

        socket.on("receive-card", (received:any) => {
            console.log("received: ",received)

            switch (received.ev) {
                case "FLOP":
                    console.log("flop: ", received.cards)
                    setFlop(received.cards);
                    break;
                case "TURN":
                    console.log("turn: ", received.cards)
                    setTurn(received.cards);
                    break;
                case "RIVER":
                    console.log("river: ", received.cards)
                    setRiver(received.cards);
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

            if(received.playing){
                console.log("set received.playing.name: ", received.playing.name)
                setPlaying(received.playing.name === myself);
            }

            if(received.players){
                console.log("set received.players: ", received.players)
                setPlayers(received.players);
                setEnemyPlayers(received.players.filter((p:any) => p.name !== myself));
            }

        });
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

    const Bet = () => {
        console.log("bet");
        socket.emit("player-action", {
            player: myself,
            action: "bet",
            amount: 10
        })
    }

    const Fold = () => {
        console.log("fold");
        socket.emit("player-action", {
            player: myself,
            action: "fold",
        })
    }

    const getCardStyle = (player : string) => {

        const index = enemyPLayers.findIndex((p:any) => p.name === player);
        switch (index) {
            case 0:
                return styles.enemyCard1
            case 1:
                return styles.enemyCard2
            case 2:
                return styles.enemyCard3
            default:
                return styles.ownCard
        }

    }

    return (
        <LinearGradient colors={["rgba(27,109,22,1)", "rgba(23,52,18,1)"]} style={styles.background}>
            <View style={styles.container}>

                <View style={styles.cards}>
                    {flop.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card} />
                    ))}
                    {turn.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card} />
                    ))}
                    {river.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card} />
                    ))}
                </View>

                <View style={styles.ownCard}>
                    {hand.map((card, index) => (
                      <CardImage key={index} card={card} style={styles.card} />
                    ))}
                </View>

                {enemyPLayers.map((player, index) => (
                  <View key={index} style={getCardStyle(player.name)}>
                      <CardImage card={"back"} style={styles.card} />
                      <CardImage card={"back"} style={styles.card} />
                  </View>
                ))}

                <View style={styles.info}>
                    <Text style={{color:"white"}}>{playing ? "Your turn" : "Waiting" }</Text>
                    {playing && (
                      <View style={styles.info_row}>
                          <Button title={"Bet"} style={styles.action_button}
                            onPress={Bet}
                          ></Button>
                          <Button title={"Fold"} style={styles.action_button}
                            onPress={Fold}
                          ></Button>
                      </View>
                    )}
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
        flexDirection: 'column',
        bottom: 250,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 5,
        padding: 10,
    },
    info_row:{
        display: 'flex',
        flexDirection: 'row',
    },
    action_button: {
        margin: 10
    }
});
