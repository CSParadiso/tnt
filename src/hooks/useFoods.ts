import {
  getFoodsById,
  getFoodsByTaxonomy,
  getFoodsByTaxonomyInfinite,
  getFoodsByTaxonomyName,
} from "@/services/clients/openfoodfacts/foods";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export function useInfiniteFoods(taxonomy: Taxonomy, value: string) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["foods", taxonomy, value],

    enabled: value.trim().length > 1,

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await getFoodsByTaxonomyInfinite(
        taxonomy,
        value,
        pageParam,
        10,
      );

      response.products.forEach((food) => {
        queryClient.setQueryData(["food", food.code], food);
      });

      return response;
    },

    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;

      return nextPage <= lastPage.page_count ? nextPage : undefined;
    },
  });
}

export function useFoodsByTaxonomyName(value: string) {
  console.debug(
    "Buscando productos a través del buscador par el valor:",
    value,
    "in",
    useFoodsByTaxonomyName,
  );

  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [value, "foods"], // Cachear por valor
    //https://tanstack.com/router/latest/docs/api/router/RouteOptionsType#staletime-property
    staleTime: 1000 * 60 * 10, // 10 minutos de validez de los datos
    gcTime: 1000 * 60 * 30, // 30 antes de borrar lo inactivo si no se accede
    queryFn: async () => {
      const foods = await getFoodsByTaxonomyName(value);

      // Agregamos cada comida a la caché ya que tiene los datos necesarios para la ficha
      foods.forEach((food) => {
        queryClient.setQueryData(["food", food.code], food);
      });

      return foods;
    },
  });
}

export function useFoodById(id: string | null) {
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodsById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
