import {
  getFoodsById,
  getFoodsByTaxonomy,
} from "@/services/clients/openfoodfacts/foods";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Taxonomy = "category" | "tag" | "brand";

export function useFoods(taxonomy: Taxonomy, value: string) {
  console.debug("Called", taxonomy, "for", value, "in", useFoods);

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [taxonomy, value, "foods"], // Cachear por taxonomia y valor
    //https://tanstack.com/router/latest/docs/api/router/RouteOptionsType#staletime-property
    staleTime: 1000 * 60 * 10, // 10 minutos de validez de los datos
    gcTime: 1000 * 60 * 30, // 30 antes de borrar lo inactivo si no se accede
    queryFn: async () => {
      const foods = await getFoodsByTaxonomy(taxonomy, value);

      // Agregamos cada comida a la caché ya que tiene los datos necesarios para la ficha
      foods.forEach((food) => {
        queryClient.setQueryData(["food", food.code], food);
      });

      return foods;
    },
  });
}

export function useFoodById(id: string) {
  console.log("useFoodById called with:", id);
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodsById(id), // only fires if not already in cache

    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
