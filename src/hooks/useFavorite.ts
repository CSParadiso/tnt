import { Foods } from "@/models/foods";
import {
  eliminarFavorito,
  guardarFavorito,
  obtenerFavoritos,
} from "@/services/accessors/favorites";
import { useEffect, useState } from "react";

export function useFavorito(food: Foods | undefined) {
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    if (!food?.code) return; // guard before any access
    obtenerFavoritos().then((favoritos) => {
      setIsFavorito(favoritos.some((f) => f.code === food.code));
    });
  }, [food?.code]); // optional chain here too

  async function toggleFavorito() {
    if (!food?.code) return; // guard before any access
    try {
      if (isFavorito) {
        await eliminarFavorito(food.code);
        setIsFavorito(false);
      } else {
        await guardarFavorito(food);
        setIsFavorito(true);
      }
    } catch (error) {
      console.error("Error al guardar/eliminar favorito", error);
      alert("Hubo un error. Por favor, intenta nuevamente.");
    }
  }

  return { isFavorito, toggleFavorito };
}
