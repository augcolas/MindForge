import {Button, Platform, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {LinearGradient} from "expo-linear-gradient";
import {useWebSocket} from "../context/socket.context";
import {Card} from "../models/card";
import {CardImage} from "../components/Card";
import Slider from "@react-native-community/slider";


export default function Game({route}: any) {
    const playerName = route.params.playerName;
    const {socket} = useWebSocket();
    const [orientation, setOrientation] = useState(1);
    const [hand, setHand] = useState<Card[]>([]);
    const [flop, setFlop] = useState<Card[]>([]);
    const [turn, setTurn] = useState<Card[]>([]);
    const [river, setRiver] = useState<Card[]>([]);
    const [myPlayer, setMyPlayer] = useState<any>(null);
    const [enemyPlayers, setEnemyPlayers] = useState<any[]>([]);
    const [playing, setPlaying] = useState<boolean>(false);
    const [money, setMoney] = useState<number>(0);
    const [betValue, setBetValue] = useState<number>(10);

    useEffect(() => {
        lockOrientation().then(r => {
        });

        socket.on("receive-card", (received: any) => {
            console.log("received: ", received)

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

            if (received.playing) {
                console.log("set received.playing.name: ", received.playing.name)
                setPlaying(received.playing.name === playerName);
            }

            if (received.players) {
                console.log("set received.players: ", received.players)
                setMyPlayer(received.players.find((p: any) => p.name === playerName));
                setEnemyPlayers(received.players.filter((p: any) => p.name !== playerName));
                setMoney(received.players.find((p: any) => p.name === playerName).money);
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
        socket.emit("player-action", {
            player: playerName,
            action: "bet",
            amount: betValue
        });
        setBetValue(10);
    }

    const Fold = () => {
        console.log("fold");
        socket.emit("player-action", {
            player: playerName,
            action: "fold",
        })
    }

    const getCardStyle = (player: string) => {
        const index = enemyPlayers.findIndex((p: any) => p.name === player);
        switch (index) {
            case 0:
                return enemy1;
            case 1:
                return enemy2;
            case 2:
                return enemy3;
        }
        return enemy1;
    }

    const onBetValueChange = (value: number) => {
        setBetValue(value);
    }


    return (
        <LinearGradient colors={["rgba(27,109,22,1)", "rgba(23,52,18,1)"]} style={styles.background}>

            <View style={styles.container}>
                <View style={styles.cards}>
                    {flop.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card}/>
                    ))}
                    {turn.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card}/>
                    ))}
                    {river.map((card, index) => (
                        <CardImage key={index} card={card} style={styles.card}/>
                    ))}
                </View>

                <View style={own.container}>
                    {myPlayer && (
                        <View style={styles.infos}>
                            <Text style={styles.info}>Name : {myPlayer.name}</Text>
                            <Text style={styles.info}>Bank : {money}</Text>
                            {myPlayer.currentBet && (
                                <Text style={styles.info}>Bet : {myPlayer.currentBet}</Text>
                            )}
                        </View>
                    )}
                    <View style={own.cards}>
                        {hand.map((card, index) => (
                          <CardImage key={index} card={card} style={styles.card}/>
                        ))}
                    </View>
                </View>

                {enemyPlayers.map((player, index) => {
                    const enemy= getCardStyle(player.name);
                    return(
                        <View key={index} style={enemy.container}>
                            <View style={[styles.infos, enemy.infos]}>
                                <Text style={styles.info}>Name : {player.name}</Text>
                                {player.currentBet && (
                                    <Text style={styles.info}>Bet : {player.currentBet}</Text>
                                )}
                            </View>
                            <View style={enemy.cards}>
                                <CardImage card={"back"} style={styles.card}/>
                                <CardImage card={"back"} style={styles.card}/>
                            </View>
                        </View>
                    )
                })}

                <View style={styles.info_container}>
                    <Text style={{color: "white"}}>{playing ? "Your turn" : "Waiting"}</Text>
                    {playing && (
                        <View>
                            <View style={styles.info_bet_slider}>
                                <Text style={styles.info_betValue}>{betValue}</Text>
                                <Slider
                                    style={{width: 200, height: 40}}
                                    step={10}
                                    minimumValue={10}
                                    maximumValue={money}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="#000000"
                                    onValueChange={onBetValueChange}
                                />
                            </View>
                            <View style={[styles.info_row, styles.info_buttons]}>
                                <View style={styles.action_button}>
                                    <Button title={"Bet"}
                                            onPress={Bet}
                                    ></Button>
                                </View>
                                <View style={styles.action_button}>
                                    <Button title={"Fold"}
                                            onPress={Fold}
                                    ></Button>
                                </View>
                            </View>

                        </View>

                    )}
                </View>
            </View>
        </LinearGradient>
    );
}

const own = StyleSheet.create({
    container: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        top: '80%'
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
    }
});
const enemy1 = StyleSheet.create({
    container: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        bottom: '80%',
    },
    infos: {},
    cards: {
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '180deg'}],
    }
})
const enemy2 = StyleSheet.create({
    container: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        right: '79%',
    },
    infos: {
        marginBottom: 25,
        marginLeft: 32
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '-90deg'}],
    }
})
const enemy3 = StyleSheet.create({
    container: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        left: '79%',
    },
    infos: {
        marginBottom: 25,
        marginLeft: 32
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '90deg'}],
    }
})

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
    infos: {
        display: 'flex',
        flexDirection: 'row',
    },
    info: {
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "white",
        textAlign: "center",
        borderRadius: 5,
        marginRight: 10,
        padding: 5
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
    info_container: {
        display: 'flex',
        flexDirection: 'column',
        bottom: 250,
        color: "white",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 5,
        padding: 10,
    },
    info_row: {
        display: 'flex',
        flexDirection: 'row',
    },
    info_buttons: {
        display: 'flex',
        gap: 5
    },
    action_button: {
        flex: 1
    },
    info_betValue: {
        color: 'white'
    },
    info_bet_slider: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});
