import { getTagsV3 } from "@/services/clients/openfoodfacts/tags";
import { useQuery } from "@tanstack/react-query";

export function useTags() {
  console.debug("Called", useTags);

  const response = useQuery({
    queryKey: ["tags"],
    staleTime: 2_000, // 10 segundos
    queryFn: function () {
      return getTagsV3();
    },
  });

  return response;
}
