import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { POINT } from "../secure/keys";
import { getFirestore } from "firebase/firestore";



// using POINT object because dotenv not working with TS in this project, don't know why...
const firebaseConfig = {
  apiKey: POINT.API_KEY,
  authDomain: POINT.AUTH_DOMAIN,
  projectId: POINT.PROJECT_ID,
  storageBucket: POINT.STORAGEBUCKET,
  messagingSenderId: POINT.MESSAGING_SENDER_ID,
  appId: POINT.APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);