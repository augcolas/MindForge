import {Button, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useWebSocket} from "../context/socket.context";

export default function Home({navigation}: any) {
    const {createRoom} = useWebSocket();

    const onCreateRoom = () => {
        createRoom().then((room) => {
            navigation.navigate('WaitingRoom');
        });

    }

    return (
        <LinearGradient
            colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
            style={styles.background}
        >
            <Button
                title="Create Room"
                onPress={() => onCreateRoom()}
            />
            <Button
                title="Join Room"
                onPress={() => navigation.navigate('Game')}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }
});
