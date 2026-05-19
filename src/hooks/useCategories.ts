import { getCategoriesV3 } from "@/services/clients/openfoodfacts/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  console.debug("Called", useCategories);

  const response = useQuery({
    queryKey: ["categories"],
    staleTime: 2_000, // 10 segundos
    queryFn: function () {
      return getCategoriesV3("frutas");
    },
  });

  return response;
}
