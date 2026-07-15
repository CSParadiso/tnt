import { Foods } from "@/models/foods";
import { useAuth } from "@/context/AuthProvider";
import {
  eliminarFavorito,
  guardarFavorito,
  suscribirFavorito,
} from "@/services/accessors/favorites";
import { useEffect, useState } from "react";

export function useFavorito(food: Foods | undefined) {
  const { user } = useAuth();
  const [isFavorito, setIsFavorito] = useState(false);

  useEffect(() => {
    if (!user || !food?.code) {
      setIsFavorito(false);
      return;
    }

    const unsubscribe = suscribirFavorito(food.code, user.uid, setIsFavorito);
    return () => unsubscribe();
  }, [user, food?.code]);

  async function toggleFavorito() {
    if (!user || !food?.code) return;
    try {
      if (isFavorito) {
        await eliminarFavorito(food.code, user.uid);
      } else {
        await guardarFavorito(food, user.uid);
      }
    } catch (error) {
      console.error("Error al guardar/eliminar favorito", error);
      alert("Hubo un error. Por favor, intenta nuevamente.");
    }
  }

  return { isFavorito, toggleFavorito };
}
