import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useWebSocket} from "../context/socket.context";

export default function WaitingRoom({navigation, route}){
  return (
    <LinearGradient
      colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
      style={styles.background}
    >
      <Text>{route.params.roomId}</Text>
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
