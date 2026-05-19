import { Marca } from "@/models/marcas";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const logos: Record<string, any> = {
  nestle: require("@/assets/images/nestle-logo.png"),
  cocacola: require("@/assets/images/coca-cola-logo.png"),
  pepsi: require("@/assets/images/pepsi-logo.png"),
  danone: require("@/assets/images/danone-logo.png"),
  kelloggs: require("@/assets/images/kelloggs-logo.png"),
  unilever: require("@/assets/images/unilever-logo.png"),
  mondelez: require("@/assets/images/mondelez-logo.png"),
  mars: require("@/assets/images/mars-logo.png"),
  ferrero: require("@/assets/images/ferrero-logo.png"),
  lactalis: require("@/assets/images/lactalis-logo.png"),
};

// https://brandslogos.com

//export const logos: Record<string, any> = {
/* nestle: require("@assets/images/coca-cola.png"), */
//cocacola: require("@/assets/images/coca-cola.png"),
//pepsi: require("../../assets/images/pepsi-logo.png"),
/* danone: require("../../assets/images/danone.png"),
  kelloggs: require("../../assets/images/kelloggs.png"),
  unilever: require("../../assets/images/unilever.png"),
  mondelez: require("../../assets/images/mondelez.png"),
  mars: require("../../assets/images/mars.png"),
  ferrero: require("../../assets/images/ferrero.png"),
  lactalis: require("../../assets/images/lactalis.png"), */
//};

const getLogo = (id: string) => {
  return logos[id] ?? logos.cocacola;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type BrandCardProps = {
  item: Marca;
};

/* export default function BrandCard({ item }: BrandCardProps) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={getLogo(item.id)}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />

      <Text style={styles.title}>{item.nombre}</Text>
    </View>
  );
} */

export default function BrandCard({ item }: BrandCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        {/* Necesario para poder lograr la redondez */}
        <Image
          style={styles.image}
          source={getLogo(item.id)}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={1000}
        />
      </View>

      <Text style={styles.title}>{item.nombre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 120,
    borderRadius: 18,
    padding: 12,
    margin: 6,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",
    // Para el box shadow - se ve en la web pero no en android
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    // Para el shadowbox de android
    elevation: 5,
  },

  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,

    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 8,

    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});
