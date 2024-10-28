import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHucgNVyumxO_Ri0iAjbC3gFVFgiTiUIg",
  authDomain: "react-notes-app-5524d.firebaseapp.com",
  projectId: "react-notes-app-5524d",
  storageBucket: "react-notes-app-5524d.appspot.com",
  messagingSenderId: "907982404368",
  appId: "1:907982404368:web:331e19b32a5475ecd24395"
};

//initializing the app ie. storing a reference for our web app
const app = initializeApp(firebaseConfig);
//initializing the database by using the cloud firestore service of firebase 
//basically we are using this service to access the database of this service
export const db = getFirestore(app)
//now since our web app will only be using the notes collection, so let's make a new collection for our notes,
//and also state where it can find that collection
export const notesCollection = collection(db, "notes")