import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHlvAPWNF4kT_yEckpEUYRrOFP_KdbikA",
  authDomain: "dustyzap-7d2b8.firebaseapp.com",
  databaseURL: "https://dustyzap-7d2b8-default-rtdb.firebaseio.com",
  projectId: "dustyzap-7d2b8",
  storageBucket: "dustyzap-7d2b8.appspot.com",
  messagingSenderId: "405704464357",
  appId: "1:405704464357:web:1395900c5f443bc9c6810c",
  measurementId: "G-PMEYVJ5CL7",
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage };
