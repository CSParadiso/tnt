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

import { Taxonomy } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";

export async function getFoodsByTaxonomy(
  taxonomy: Taxonomy,
  value: string,
  query: string = ""
): Promise<Foods[]> {
  // Agregar guiones para evitar los espacios en la URL
  value = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  // El dominio world.openfoodfacts.org es el estándar
  const BASE_URL = `https://world.openfoodfacts.org/api/v2/search`;

  // Parámetros obligatorios en v3:
  // tagtype: qué tipo de datos queremos (categories)
  // lc: código de idioma (es para español)
  // string: el término de búsqueda
  // Si es categoria
  const params =
    taxonomy === "category"
      ? new URLSearchParams({
          categories_tags_es: value,
          tagtype: "foods",
          lc: "es",
          /* string: `categories_tags_es=${category}`, */
          limit: "20",
        })
      : taxonomy === "brand"
      ? new URLSearchParams({
          brands_tags: value,
          tagtype: "foods",
          lc: "es",
          /* string: `categories_tags_es=${category}`, */
          limit: "20",
        })
      : new URLSearchParams({
          labels_tags: value,
          tagtype: "foods",
          lc: "es",
          /* string: `categories_tags_es=${category}`, */
          limit: "20",
        });
  // tagtype=foods&lc=es&string={query}&limit=20

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": "tnt-2026-UNTDF", // OFF
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  /* console.debug(`${BASE_URL}?${params.toString()}`);*/
  console.debug(data.products);

  return data.products;
}

export async function getFoodsById(code: string): Promise<Foods> {
  // El dominio world.openfoodfacts.org es el estándar
  const BASE_URL = `https://world.openfoodfacts.org/api/v3/product${code}`;

  // Parámetros obligatorios en v3:
  // tagtype: qué tipo de datos queremos (categories)
  // lc: código de idioma (es para español)
  // string: el término de búsqueda
  const params = new URLSearchParams({
    product_type: "food",
    lc: "es",
    /* string: `categories_tags_es=${category}`, */
    limit: "20",
  });
  // tagtype=foods&lc=es&string={query}&limit=20

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "User-Agent": "tnt-2026-UNTDF", // OFF
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  /* console.debug(`${BASE_URL}?${params.toString()}`);
  console.debug(data.products); */

  return data;
}
