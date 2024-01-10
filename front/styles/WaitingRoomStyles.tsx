import { StyleSheet } from 'react-native';

export const waitingRoomStyles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    leftContainer: {
    },
    spacesButton: {
        height: 10
    },
    rightContainer: {
    },
    text: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 1,
    },
    centerText: {
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        fontWeight: 'bold',
        marginBottom: 2
    },
    roomCodeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    ownerRectangle: {
        padding: 2,
        marginTop: 10,
    },
    ownerText: {
        color: '#000',
        fontSize: 16,
    },
    playersRectangle: {
        padding: 10,
    },
    playerText: {
        color: '#000',
        fontSize: 16,
        marginBottom: 5,
    },
    footerButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 3,
    },
    logo: {
        width: 200, // Ajustez la largeur selon vos besoins
        height: 200, // Ajustez la hauteur selon vos besoins
    },
});
