// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYPz5Iemo0lIo6wyUPjaLUOKEIRqmyn3w",
  authDomain: "Ynirdeshonadigits.firebaseapp.com",
  projectId: "nirdeshonadigits",
  storageBucket: "nirdeshonadigits.firebasestorage.appT",
  messagingSenderId: "Y1041165291301",
  appId: "1:1041165291301:web:835dcdace60d4b7a1294cc",
  measurementId: "G-XFZ0PVEPMH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithPhoneNumber, RecaptchaVerifier };