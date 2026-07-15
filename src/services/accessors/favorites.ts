import { Foods } from "@/models/foods";
import { ref, set, remove, get, onValue } from "firebase/database";
import { database } from "../auth/firebase";

function userFavsRef(uid: string) {
  return ref(database, `users/${uid}/favorites`);
}

function favRef(uid: string, code: string) {
  return ref(database, `users/${uid}/favorites/${code}`);
}

export const obtenerFavoritos = async (uid: string): Promise<Foods[]> => {
  const snapshot = await get(userFavsRef(uid));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.values(data) as Foods[];
};

export const guardarFavorito = async (food: Foods, uid: string): Promise<void> => {
  await set(favRef(uid, food.code), food);
};

export const eliminarFavorito = async (code: string, uid: string): Promise<void> => {
  await remove(favRef(uid, code));
};

export const esFavorito = async (code: string, uid: string): Promise<boolean> => {
  const snapshot = await get(favRef(uid, code));
  return snapshot.exists();
};

export const suscribirFavoritos = (
  uid: string,
  callback: (favoritos: Foods[]) => void
): (() => void) => {
  return onValue(userFavsRef(uid), (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    callback(Object.values(data) as Foods[]);
  });
};

export const suscribirFavorito = (
  code: string,
  uid: string,
  callback: (isFavorito: boolean) => void
): (() => void) => {
  return onValue(favRef(uid, code), (snapshot) => {
    callback(snapshot.exists());
  });
};
