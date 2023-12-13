import {Button, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useWebSocket} from "../context/socket.context";

export default function WaitingRoom() {
    const {getRoom} = useWebSocket();
    return (
        <LinearGradient
            colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
            style={styles.background}
        >

            <Text style={styles.text}>{getRoom().uuid}</Text>
            <View style={styles.containerOwner}>
                <Text style={[styles.text, styles.textCenter]}>Owner</Text>
                <View style={styles.containerOwnerRectangle}>
                    <Text style={styles.ownerText}>{getRoom().owned}</Text>
                </View>
            </View>


            <View style={styles.containerPlayers}>
                <Text style={styles.text}>Players in rooms: </Text>
                <View style={styles.containerPlayersRectangle}>
                    {getRoom().players.map((player) => <Text style={styles.containerPlayersText}>{player}</Text>)}
                </View>
            </View>


            <View style={styles.footer}>
                <Button title={"Start game"}></Button>
                <Button title={"Quit room"}></Button>
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingTop: "10%"
    },
    text: {
        color: "white",
        fontSize: 16
    },
    textCenter: {
        textAlign: "center"
    },
    containerPlayers: {
        marginTop: 20,
    },
    containerPlayersRectangle: {
        width: 300,
        height: "50%",
        backgroundColor: "white",
        borderRadius: 10,
    },
    containerOwner: {
        marginTop: 20
    },
    containerOwnerRectangle: {
        width: 300,
        height: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    containerPlayersText: {
        marginLeft: 10,
    },
    ownerText: {
        color: "black"
    },
    footer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly"

    }
});
