import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {useWebSocket} from "../context/socket.context";
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function WaitingRoom(){
  const {getRoom} = useWebSocket();
  return (
    <LinearGradient
      colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
      style={styles.background}
    >
      <Text>{getRoom().uuid}</Text>
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
