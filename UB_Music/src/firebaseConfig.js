import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importar Firestore
import { getStorage } from "firebase/storage"; // Importar Storage

const firebaseConfig = {
    apiKey: "AIzaSyAecmomly5tU5T17qGwL8VLsjU08a_7vws",
    authDomain: "ub-music-be4a3.firebaseapp.com",
    projectId: "ub-music-be4a3",
    storageBucket: "ub-music-be4a3.appspot.com",
    messagingSenderId: "393995234011",
    appId: "1:393995234011:web:763fcd970083288456bafe"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializar Firestore
const storage = getStorage(app); // Inicializar Storage

export { auth, db, storage }; // Exportar Firestore y Storage
