export type NutriComponent = {
  id: string;
  points: number;
  points_max: number;
  unit: string;
  value: number;
};

export type Foods = {
  product: {
    product_name: string;
  };
  product_type: string;
  product_name: string;
  brands: string;
  nutriscore_grade: string;
  nutrition_data_per: string;
  nutriscore_data: {
    components: {
      negative: NutriComponent[];
      positive: NutriComponent[];
    };
  };
  ecoscore_grade: string;
  code: string;
  codes_tags: [string];
  generic_name: string;
  id: string;
  ingredients_text_es: string;
  lc: string;
  lang: string;
  nova_group: number;
  nova_groups: string;
  obsolete: string;
  obsolete_since_date: string;
  product_quantity: string;
  product_quantity_unit: string;
  quantity: string;
  schema_version: number;
  image_front_small_url: string;
  // Dynamic translated fields
  [key: `product_name_${string}`]: string;
  [key: `abbreviated_product_name_${string}`]: string;
  [key: `generic_name_${string}`]: string;
};
