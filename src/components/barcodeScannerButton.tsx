import { useFoodById } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  route?: AppRoute;
};

export default function BarcodeScannerButton({ route = ROUTES.FOODS }: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");

  const { data: food, isLoading, error } = useFoodById(barcode);

  const openScanner = () => {
    setBarcode(null);
    setScanned(false);
    setCameraVisible(true);
  };

  const closeScanner = () => {
    setCameraVisible(false);
    setScanned(false);
  };

  const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    setBarcode(data);
  };

  const navToItem = (item: Foods) => {
    closeScanner();
    router.push(buildRoute(route, { id: item.code }));
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  useEffect(() => {
    if (!scanned || isLoading) return;

    if (food) return;

    const timer = setTimeout(() => {
      setBarcode(null);
      setScanned(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [scanned, isLoading, food]);

  if (!permission) return null;

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={async () => {
          if (!permission.granted) {
            requestPermission();
            return;
          }

          openScanner();
        }}
      >
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

      <Modal
        visible={cameraVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          {isLoading && (
            <View style={styles.overlay}>
              <Text style={styles.text}>Buscando producto...</Text>
            </View>
          )}

          {food && (
            <View style={styles.bottom}>
              <TouchableOpacity
                style={styles.productButton}
                onPress={() => navToItem(food)}
              >
                <Text style={styles.text}>Ver producto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.productButton}
                onPress={() => {
                  setBarcode(null);
                  setScanned(false);
                }}
              >
                <Text style={styles.text}>Escanear otro</Text>
              </TouchableOpacity>
            </View>
          )}

          {!food && (
            <View style={styles.bottom}>
              <TouchableOpacity
                style={styles.productButton}
                onPress={toggleCameraFacing}
              >
                <Text style={styles.text}>Cambiar cámara</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.productButton}
                onPress={closeScanner}
              >
                <Text style={styles.text}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  cameraIcon: {
    fontSize: 24,
  },

  modalContainer: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
  },

  bottom: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    gap: 15,
  },

  productButton: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 10,
  },

  text: {
    color: "white",
    fontWeight: "700",
  },
});
