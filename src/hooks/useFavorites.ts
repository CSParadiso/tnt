import { Foods } from "@/models/foods";
import { useAuth } from "@/context/AuthProvider";
import {
  eliminarFavorito,
  guardarFavorito,
  suscribirFavoritos,
  suscribirFavorito,
} from "@/services/accessors/favorites";
import { useEffect, useState } from "react";

export function useFavoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<Foods[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavoritos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = suscribirFavoritos(user.uid, (data) => {
      setFavoritos(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function eliminar(code: string) {
    if (!user) return;
    await eliminarFavorito(code, user.uid);
  }

  return { favoritos, isLoading, eliminar };
}

export function useFavorito(food: Foods) {
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
    if (isFavorito) {
      await eliminarFavorito(food.code, user.uid);
    } else {
      await guardarFavorito(food, user.uid);
    }
  }

  return { isFavorito, toggleFavorito };
}
