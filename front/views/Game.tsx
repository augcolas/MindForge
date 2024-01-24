import {Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {LinearGradient} from "expo-linear-gradient";
import card1 from '../assets/cards/2-C.png';
import card2 from '../assets/cards/3-C.png';
import card3 from '../assets/cards/A-C.png';
import card4 from '../assets/cards/K-C.png';
import card5 from '../assets/cards/10-C.png';
import backBlue from '../assets/cards/backBlue.png';
import token10 from '../assets/tokens/10.png';
import token20 from '../assets/tokens/20.png';
import token30 from '../assets/tokens/30.png';

export default function Game() {
    const [orientation, setOrientation] = useState(1);
    useEffect(() => {
        lockOrientation();
    }, []);
    const lockOrientation = async () => {
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
                    <Image source={card1} style={styles.card}></Image>
                    <Image source={card2} style={styles.card}></Image>
                    <Image source={card3} style={styles.card}></Image>
                    <Image source={card4} style={styles.card}></Image>
                    <Image source={card5} style={styles.card}></Image>
                </View>
                <View style={styles.ownCard}>
                    <Image source={card1} style={styles.card}></Image>
                    <Image source={card3} style={styles.card}></Image>
                </View>
                <View style={styles.enemyCard1}>
                    <Image source={backBlue} style={styles.card}></Image>
                    <Image source={backBlue} style={styles.card}></Image>
                </View>
                <View style={styles.enemyCard2}>
                    <Image source={backBlue} style={styles.card}></Image>
                    <Image source={backBlue} style={styles.card}></Image>
                </View>
                <View style={styles.enemyCard3}>
                    <Image source={backBlue} style={styles.card}></Image>
                    <Image source={backBlue} style={styles.card}></Image>
                </View>
            </View>
            <View style={styles.tokens}>
                <Image source={token10} style={styles.token}></Image>
                <Image source={token10} style={styles.token}></Image>
                <Image source={token20} style={styles.token}></Image>
                <Image source={token30} style={styles.token}></Image>
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
        top: '85%'
    },
    enemyCard1: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        bottom: '85%',
        margin: 'auto',
    },
    enemyCard2: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '90deg'}],
        margin: 'auto',
        right: '90%',
    },
    enemyCard3: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        transform: [{rotateZ: '90deg'}],
        margin: 'auto',
        left: '90%',
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
    }
});
