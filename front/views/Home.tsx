import { StyleSheet, Button, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({navigation} : any){
	return (
		<LinearGradient
			colors={['rgba(27,109,22,1)', 'rgba(23,52,18,1)']}
			style={styles.background}
		>
			<Text>Open up App.tsx to start working on your app!</Text>
			<Button
				title="Play Game"
				onPress={() => navigation.navigate('Game')} // Navigate to the "Game" screen
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
