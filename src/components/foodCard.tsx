import { Foods } from "@/models/foods";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const nutriscoreColor: Record<string, string> = {
  a: "#038141",
  b: "#85BB2F",
  c: "#FECB02",
  d: "#EE8100",
  e: "#E63E11",
};

const ecoscoreColor: Record<string, string> = {
  "a+": "#1E8F4E",
  a: "#1E8F4E",
  b: "#56A43A",
  c: "#F5A623",
  d: "#E07020",
  e: "#CC1F1F",
};

type FoodCardProps = {
  food: Foods;
};

export default function FoodCard({ food }: FoodCardProps) {
  const nutri = food.nutriscore_grade?.toLowerCase();
  const eco = food.ecoscore_grade?.toLowerCase();

  return (
    <View style={styles.container}>
      {/* Izquierda*/}
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={food.image_front_small_url}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={500}
        />
      </View>

      {/* Centro */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {food.product_name ?? food.generic_name ?? "—"}
        </Text>
        <Text style={styles.brand} numberOfLines={1}>
          {food.brands?.toUpperCase() ?? ""}
        </Text>

        {/* Derecha */}
        <View style={styles.badges}>
          {nutri ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: nutriscoreColor[nutri] ?? "#aaa" },
              ]}
            >
              <Text style={styles.badgeLabel}>NUTRI-{"\n"}SCORE</Text>
              <Text style={styles.badgeValue}>
                {["NOT-APPLICABLE", "UNKNOWN"].includes(nutri.toUpperCase())
                  ? "-"
                  : nutri.toUpperCase()}
              </Text>
            </View>
          ) : null}

          {eco ? (
            <View
              style={[
                styles.badge,
                styles.ecoBadge,
                { borderColor: ecoscoreColor[eco] ?? "#aaa" },
              ]}
            >
              <Text style={[styles.badgeLabel, { color: "#333" }]}>
                ECO-{"\n"}SCORE
              </Text>
              <Text
                style={[
                  styles.badgeValue,
                  { color: ecoscoreColor[eco] ?? "#aaa" },
                ]}
              >
                {["NOT-APPLICABLE", "UNKNOWN"].includes(eco.toUpperCase())
                  ? "-"
                  : eco.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* RIGHT — chevron */}
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // ← key: horizontal layout
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // LEFT
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // CENTER
  content: {
    flex: 1,
    height: 100, // same as image
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  brand: {
    fontSize: 14,
    color: "#777",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },

  badge: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    paddingVertical: 6,
    gap: 4,
  },
  ecoBadge: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 11,
  },
  badgeValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#fff",
  },

  // RIGHT
  chevron: {
    fontSize: 24,
    color: "#ccc",
    flexShrink: 0,
  },
});
