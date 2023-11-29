import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import Home from "./views/Home";

export default function App() {
  return (
    <View style={styles.container}>
      <Home/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
