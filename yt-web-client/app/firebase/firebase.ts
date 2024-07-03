// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
 } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgWJv6CTYtFe2VdYvMH6_HdyqOHnk6iW4",
  authDomain: "yt-clone-b8610.firebaseapp.com",
  projectId: "yt-clone-b8610",
  appId: "1:600114332480:web:b40be7459a4ab8688070a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

/**
 * Signs the user out
 * @returns A promise that resolves when the user is signed out
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}


