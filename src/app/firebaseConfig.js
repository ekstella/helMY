// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVk3xpiKGJYz_l0GqSGEH5JWmxJD9GOKg",
  authDomain: "helmy-a9382.firebaseapp.com",
  projectId: "helmy-a9382",
  storageBucket: "helmy-a9382.firebasestorage.app",
  messagingSenderId: "268084337821",
  appId: "1:268084337821:web:4455ea38f24d38b7698874",
  measurementId: "G-5GZLCDR9WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);