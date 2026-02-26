import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcR5ygijxJbDRqQhWiHhLbrCUvQZ8MP5I",
  authDomain: "social-media-schedular-9568a.firebaseapp.com",
  projectId: "social-media-schedular-9568a",
  storageBucket: "social-media-schedular-9568a.appspot.com",
  messagingSenderId: "918815055354",
  appId: "1:918815055354:web:11cc809941f0f7f4f39843",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
