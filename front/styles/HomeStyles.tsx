import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    height: 40,
    marginBottom: 60,
    padding: 8,
    width: "100%",
    color: "#fff",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: "100%",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Opacité du fond de la modale
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 15,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#fff",
  },  
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Opacité du fond de la modale
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff", // Couleur du texte de titre dans la modale
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    color: "#fff", // Couleur du texte de l'input dans la modale
  },
  modalButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 200, // Ajustez la largeur selon vos besoins
    height: 200, // Ajustez la hauteur selon vos besoins
  },
  
  
});
