import { ErrorState } from "@/components/errorState";
import FoodCard from "@/components/foodCard";
import { LoadingState } from "@/components/loadingState";
import { useFoodById, useFoodsByTaxonomyName } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  const { data: food, isLoading, error } = useFoodById(barcode);

  const router = useRouter();

  const navToItem = (item: Foods) => {
    setCameraVisible(false);
    setScanned(false);

    router.push(buildRoute(ROUTES.FOODS, { id: item.code }));
  };

  const goToSettings = () => {
    Linking.openSettings();
  };

  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned) return;

    console.log("### Tipo:", type, "Data:", data);

    setScanned(true);
    setBarcode(data);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const openScanner = () => {
    setBarcode(null);
    setScanned(false);
    setCameraVisible(true);
  };

  const closeScanner = () => {
    setCameraVisible(false);
    setScanned(false);
  };

  // AUTO RESCAN LOGIC
  useEffect(() => {
    if (!scanned || isLoading) return;

    // If product exists → stop scanning (user decides what to do)
    if (food) return;

    // If product NOT found → retry scanning after 2 seconds
    const timer = setTimeout(() => {
      setBarcode(null);
      setScanned(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanned, isLoading, food]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted && permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Ir a ajustes de permisos</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Ir a ajustes de permisos</Text>
        <Button onPress={goToSettings} title="Go to Settings" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Buscador />
      {/* <Stack.Screen options={{ title: "Buscar" }} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <SeccionList
          title="Buscar"
          //rawId={rawId} // pass rawId so SeccionList can fetch
          rawId="21" // pass rawId so SeccionList can fetch
          subtitle=""
          route={ROUTES.FOODS}
        />
      </ScrollView> */}
      <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
        <Text style={styles.scanButtonText}>Escanear código de barras</Text>
      </TouchableOpacity>

      <Modal
        visible={cameraVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeScanner}
      >
        <View style={styles.modalContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: [
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "qr",
                "aztec",
                "pdf417",
                "datamatrix",
                "code39",
                "code93",
                "code128",
                "codabar",
                "itf14",
              ],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />
          {isLoading && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Buscando producto...</Text>
            </View>
          )}
          {error && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                Error al buscar el producto.
              </Text>
            </View>
          )}
          {/* // Si hay comida no se muestran estos botones, ya que se muestran los
          botones de producto y escanear otro */}
          {!food && (
            <View style={styles.bottomControls}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.secondaryButtonText}>Cambiar cámara</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeScanner}
              >
                <Text style={styles.secondaryButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
          {food && (
            <View style={styles.productContainer}>
              <TouchableOpacity
                style={styles.productButton}
                onPress={() => navToItem(food)}
              >
                <Text style={styles.productButtonText}>Ver producto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={() => {
                  setBarcode(null);
                  setScanned(false);
                }}
              >
                <Text style={styles.scanAgainButtonText}>Escanear otro</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

type SectionListProps = {
  title: string;
  palabra: string; // added
  subtitle: string;
  route: AppRoute;
};

const SeccionList = ({ title, palabra, subtitle, route }: SectionListProps) => {
  const router = useRouter();

  // Es necesario buscar por nombre de categoria, etiqueta o marca en lugar de ID porque el usuario puede escribir cualquier cosa en el buscador, no solo IDs.
  // TODO Falta resolver bien como buscar por diferentes taxonomías (varios filtrdos funcionan como AND).
  const { data, isError, isLoading } = useFoodsByTaxonomyName(palabra); //

  const navToItem = (item: Foods) => {
    router.push(buildRoute(route, { id: item.code }));
  };

  return (
    <View style={styles.listBlock}>
      <View style={styles.listTitleRow}>
        {/* <Text style={styles.listTitle}>{title}</Text> */}
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.panel}>
        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState /> : null}
        {!isLoading && !isError ? (
          <FlatList
            style={{ width: "100%" }}
            scrollEnabled={false}
            data={data}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                style={styles.gridItem}
                onPress={() => navToItem(item)}
              >
                <FoodCard food={item} />
              </Pressable>
            )}
          />
        ) : null}
      </View>
    </View>
  );
};

// Debounce para no liquidar a la API con cada letra que el usuario escribe en el buscador

function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function Buscador() {
  const [texto, setTexto] = useState("");
  const debouncedText = useDebounce(texto, 400);

  return (
    <View style={{ gap: 12 }}>
      <TextInput
        style={{ height: 60, width: 300, backgroundColor: "lightgray" }}
        onChangeText={setTexto}
        value={texto}
        placeholder="Buscar..."
      />

      {debouncedText.trim().length > 1 ? (
        <SeccionList
          title="Buscar"
          palabra={debouncedText}
          subtitle=""
          route={ROUTES.FOODS}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: "column",
    /* alignItems: "center", */
    gap: 20,
  },
  gridItem: {
    flex: 1,
    margin: 6,
  },
  listBlock: {
    width: "100%",
    //maxWidth: 420,
    gap: 12,
  },
  panel: {
    flex: 1,
  },
  listContent: {
    gap: 10,
  },
  listTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 8,
    rowGap: 4,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  listSubtitle: {
    fontSize: 16,
    fontWeight: "200",
  },
  itemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  itemText: {
    fontSize: 16,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },

  modalContainer: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  scanButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  overlay: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  overlayText: {
    color: "#fff",
    fontWeight: "600",
  },

  bottomControls: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  secondaryButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  closeButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  secondaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  productContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },

  productButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },

  productButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  scanAgainButton: {
    marginTop: 12,
    backgroundColor: "#1976D2",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },

  scanAgainButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
