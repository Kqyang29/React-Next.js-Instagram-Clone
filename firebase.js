// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwJHTDuYNgPhVkkh1JtG_M9k1RSUjYux4",
  authDomain: "react-next-instagram-clone.firebaseapp.com",
  projectId: "react-next-instagram-clone",
  storageBucket: "react-next-instagram-clone.appspot.com",
  messagingSenderId: "446731690782",
  appId: "1:446731690782:web:a5ee72a647b688607d1f0f"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

const storage = getStorage();

export { db, storage };
