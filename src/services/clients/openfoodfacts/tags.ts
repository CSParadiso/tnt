/* import { Food } from "@/models/foods";

const BASE_URL = "https://world.openfoodfacts.org";

const headers = {
  "User-Agent": "tnt-alimentos",
};

export const getFoodsByCategory = async (category: string): Promise<Food[]> => {
  const res = await fetch(
    `${BASE_URL}/api/v2/search/categories_tags/${category}`,
    {
      method: "GET",
      headers,
    }
  );
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

  // Retornamos solo el listado de productos y no todo el json de categoria
  const data: { products: Food[] } = await res.json();

  return res.json();
};
 */

export async function getTagsV3(query: string = ""): Promise<string[]> {
  // El dominio world.openfoodfacts.org es el estándar
  const baseUrl = "https://world.openfoodfacts.net/api/v3/taxonomy_suggestions";

  // Parámetros obligatorios en v3:
  // tagtype: qué tipo de datos queremos (categories)
  // lc: código de idioma (es para español)
  // string: el término de búsqueda
  const params = new URLSearchParams({
    tagtype: "labels",
    lc: "es",
    string: query,
    limit: "20",
  });
  // tagtype=categories&lc=es&string={query}&limit=20

  console.debug("Called", `${baseUrl}?${params.toString()}`);

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      "User-Agent": "tnt-alimentos-2026-UNTDF", // OFF
    },
  });

  //console.debug(response);

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  console.log(data);

  return data.suggestions as string[];
}
