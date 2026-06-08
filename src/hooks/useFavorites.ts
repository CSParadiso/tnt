import { Foods } from "@/models/foods";
import {
  eliminarFavorito,
  esFavorito,
  guardarFavorito,
  obtenerFavoritos,
} from "@/services/accessors/favorites";
import { useEffect, useState } from "react";

// For the favorites list screen
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Foods[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    obtenerFavoritos()
      .then(setFavoritos)
      .finally(() => setIsLoading(false));
  }, []);

  async function eliminar(code: string) {
    await eliminarFavorito(code);
    setFavoritos((prev) => prev.filter((f) => f.code !== code));
  }

  return { favoritos, isLoading, eliminar };
}

// For a single food item (detail/card toggle)
export function useFavorito(food: Foods) {
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    esFavorito(food.code).then(setIsFavorito);
  }, [food.code]);

  async function toggleFavorito() {
    if (isFavorito) {
      await eliminarFavorito(food.code);
    } else {
      await guardarFavorito(food);
    }
    setIsFavorito((prev) => !prev);
  }

  return { isFavorito, toggleFavorito };
}
