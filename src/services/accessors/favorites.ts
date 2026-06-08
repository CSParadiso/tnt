import { Foods } from "@/models/foods";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITOS_KEY = "productosFavoritos";

export const obtenerFavoritos = async (): Promise<Foods[]> => {
  const raw = await AsyncStorage.getItem(FAVORITOS_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  // Guard against old string format or any non-array value
  return Array.isArray(parsed) ? parsed : [];
};

export const guardarFavorito = async (food: Foods): Promise<void> => {
  const current = await obtenerFavoritos();
  const exists = current.some((f) => f.code === food.code);
  if (!exists)
    await AsyncStorage.setItem(
      FAVORITOS_KEY,
      JSON.stringify([...current, food])
    );
};

export const eliminarFavorito = async (code: string): Promise<void> => {
  const current = await obtenerFavoritos();
  const updated = current.filter((f) => f.code !== code);
  await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(updated));
};

export const esFavorito = async (code: string): Promise<boolean> => {
  const current = await obtenerFavoritos();
  return current.some((f) => f.code === code);
};
