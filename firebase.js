import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyDXAd2_NZIVGLPinV_HlLRPrYjWkRJEGfM",
  authDomain: "docs-617d0.firebaseapp.com",
  projectId: "docs-617d0",
  storageBucket: "docs-617d0.appspot.com",
  messagingSenderId: "305130414132",
  appId: "1:305130414132:web:5a40add2dc6f134ff62a61",
};

const app = !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };