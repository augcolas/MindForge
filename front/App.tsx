import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from "./views/Home";
import Game from "./views/Game";
import {WebSocketProvider} from "./context/socket.context";
import WaitingRoom from "./views/WaitingRoom";

const Stack = createStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <WebSocketProvider>
                <Stack.Navigator
                    initialRouteName="Game"
                    screenOptions={{headerShown: false}}
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                    <Stack.Screen
                        name="WaitingRoom"
                        component={WaitingRoom}
                    />
                    <Stack.Screen
                        name="Game"
                        component={Game}
                    />
                </Stack.Navigator>
            </WebSocketProvider>
        </NavigationContainer>
    );
}
