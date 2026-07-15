import { initializeApp } from "firebase/app";
// @ts-ignore - getReactNativePersistence is exported by Firebase for RN but types don't reflect it
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiv_hgRc6AIdEtxGaUMhlN7asi2QHi5NU",
  authDomain: "tnt-alimentos.firebaseapp.com",
  databaseURL: "https://tnt-alimentos-default-rtdb.firebaseio.com/",
  projectId: "tnt-alimentos",
  storageBucket: "tnt-alimentos.firebasestorage.app",
  messagingSenderId: "748290577201",
  appId: "1:748290577201:web:fdff5ad84a7c53a44e5610",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const database = getDatabase(app);
