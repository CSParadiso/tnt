import {
  getFoodsByCategory,
  getFoodsById,
} from "@/services/clients/openfoodfacts/foods";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useFoods(category: string) {
  console.debug("Called", useFoods);

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [`${category}-foods`], // Cachear el par categoría-foods
    //https://tanstack.com/router/latest/docs/api/router/RouteOptionsType#staletime-property
    staleTime: 1000 * 60 * 10, // 10 minutos de validez de los datos
    gcTime: 1000 * 60 * 30, // 30 antes de borrar lo inactivo si no se accede
    queryFn: async () => {
      const foods = await getFoodsByCategory(category);

      // Agregamos cada comida a la caché ya que tiene los datos necesarios para la ficha
      foods.forEach((food) => {
        queryClient.setQueryData(["food", food.id], food);
      });

      return foods;
    },
  });
}

export function useFoodById(id: string) {
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodsById(id), // only fires if not already in cache
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
