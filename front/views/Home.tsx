import {Button, StyleSheet, TextInput} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useWebSocket} from "../context/socket.context";
import {useState} from "react";

export default function Home({navigation}: any) {
    const {createRoom, joinRoom} = useWebSocket();
    const [text, setText] = useState('');

    const onCreateRoom = () => {
        createRoom().then((room) => {
            navigation.navigate('WaitingRoom');
        });
    }

    const handleTextChange = (inputText:string) => {
        setText(inputText);
    };


    const onJoinRoom = () => {
        joinRoom(text, "").then(() => {
            navigation.navigate('WaitingRoom');
        });
    }

    return (
        <LinearGradient
            colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
            style={styles.background}
        >
            <TextInput
                style={styles.input}
                placeholder="Saisissez du texte"
                onChangeText={handleTextChange}
                value={text}
            />
            <Button
                title="Create Room"
                onPress={() => onCreateRoom()}
            />
            <Button
                title="Join Room"
                onPress={() => onJoinRoom()}
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
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        width: '100%',
    },
});
