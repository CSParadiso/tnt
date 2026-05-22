import { getBrandsV3 } from "@/services/clients/openfoodfacts/brands";
import { useQuery } from "@tanstack/react-query";

export function useBrands() {
  console.debug("Called", useBrands);

  const response = useQuery({
    queryKey: ["brands"],
    staleTime: 2_000, // 10 segundos
    queryFn: function () {
      return getBrandsV3();
    },
  });

  return response;
}
