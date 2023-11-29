import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home(){
  return (
    <LinearGradient
      colors={['rgb(22,42,109)', 'rgb(18,24,52)']}
      style={styles.background}
    >
      <Text>Open up App.tsx to start working on your app!</Text>
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
