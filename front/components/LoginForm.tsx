import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Text, TouchableOpacity, SafeAreaView, Image, Dimensions } from 'react-native';
import {LinearGradient} from "expo-linear-gradient";

// Obtenir la largeur de l'écran
const windowWidth = Dimensions.get('window').width;
// Supposer que tout appareil avec une largeur inférieure à un certain seuil est un mobile
const isMobile = windowWidth < 768;

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.loginContainer}>
                <View style={styles.formContainer}>
                    <TouchableOpacity style={styles.row}>
                            <Image source={require('../assets/arrow.png')} style={styles.arrow}/>
                            <Text style={styles.header}>Connexion</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="Adresse e-mail"
                        keyboardType="email-address"
                    />
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        placeholder="Mot de passe"
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>
                    <View style={styles.footer}>
                        <TouchableOpacity>
                            <Text style={styles.footerText}>Créer un compte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.footerText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {!isMobile && (
                    <View style={styles.pictureView}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 0.9 }} style={styles.pictureView} colors={['rgba(93,112,117,0.25)', 'rgba(255,255,255,0)']} >
                            <Image source={require('../assets/Logo.png')} style={styles.image}/>
                        </LinearGradient>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 75,
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    loginContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center', // Centrer les enfants verticalement
        justifyContent: 'center', // Centrer les enfants horizontalement
        backgroundColor: '#ffffff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
    },
    formContainer: {
        height: '100%',
        flex: 1, // Prend la moitié de l'espace disponible
        paddingHorizontal: 40,
        //Set box shadow only on the left border
        shadowColor: '#000',
        shadowOffset: { width: 10, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 1,
    },
    image: {
        height: '100%',
        flex: 1,
        resizeMode: 'contain',
    },
    arrow: {
        height: 30,
        width: 30,
    },
    header: {
        fontSize: 26,
        marginBottom: 20,
        marginLeft: 10,

    },
    input: {
        height: 50,
        backgroundColor: '#e8e8e8',
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#5D7075',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#5D7075',
        fontSize: 16,
        fontWeight: '600',
    },
    pictureView: {
        height: '100%',
        flex: 1,
        resizeMode: 'contain',
    },
    row: {
        paddingTop: 30,
        marginBottom: 30,
        flexDirection: 'row',
    },
    label: {
    },

});

export default App;
