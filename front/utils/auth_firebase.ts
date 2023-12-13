import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export const authSignupPassword = async (email: string, password: string) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
}

export const authSigninPassword = async (email: string, password: string) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
}

/*
export const onAuthStateChange = (callback: any) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            callback(user)
        } else {
            callback(null)
        }
    });
}*/