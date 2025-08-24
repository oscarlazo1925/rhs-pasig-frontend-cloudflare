import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOcgOjAO2W-3m-GkKRdgPenmDOLy6Guxg",
  authDomain: "indioxoftrade.firebaseapp.com",
  projectId: "indioxoftrade",
  storageBucket: "indioxoftrade.firebasestorage.app",
  messagingSenderId: "39159763906",
  appId: "1:39159763906:web:4729cfad1abdef178c7c5b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
