 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy7121N73VOGWxTChm96k_NkPVtCAMkU0",
  authDomain: "ub-music.firebaseapp.com",
  projectId: "ub-music",
  storageBucket: "ub-music.appspot.com",
  messagingSenderId: "684498179393",
  appId: "1:684498179393:web:e96507778e6725b9ecbdc0",
  measurementId: "G-BV9V687HG8"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);

export default appFirebase;