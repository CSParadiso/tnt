import { Href } from "expo-router";

export const ROUTES = {
  HOME: "/", //(tabs)/index
  TABS_FAVS: "/favs", //(tabs)/favs
  TABS_SEARCH: "/search", //(tabs)/seacrh
  CATEGORIES: "/categories/[id]", //categories/{id}
  TAGS: "/tags/[id]",
  BRANDS: "/brands/[nombre]",
  FOODS: "/foods/[id]",
  /* ALIMENTO: "/alimento",
  FORMULARIO_PASO_1: "/formulario/paso1",
  FORMULARIO_PASO_2: "/formulario/paso2",
  CATEGORIA: "/categorias/[nombre]",
  MARCA: "/marcas/[nombre]",
  FICHA: "/ficha/[id]",
  LISTA_FLATLIST: "/ejemplos/lista-flatlist",
  SIMPLE_STATE: "/ejemplos/simple-state",
  INPUT_FILTER: "/ejemplos/input-filter", */
} as const;

// Este tipo se construye tomando el objeto ROUTES, obteniendo sus claves con `keyof`
// y luego usando esas claves para formar la union de todos sus valores literales.
export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
type RouteParams = Record<string, string | number | boolean | undefined>;

export const buildRoute = (route: AppRoute, params?: RouteParams): Href => {
  if (!params) {
    return route as Href;
  }

  return {
    pathname: route,
    params,
  } as unknown as Href;
};

/* export function fichaShowRoute(id: number) {
  return buildRoute(ROUTES.CATEGORIES, { id: id.toString() });
} */
