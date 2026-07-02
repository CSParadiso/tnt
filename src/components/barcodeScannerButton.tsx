import { useFoodById } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { AppRoute, buildRoute, ROUTES } from "@/navigation/routes";
import { Ionicons } from "@expo/vector-icons";
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

  const { data: food, isLoading } = useFoodById(barcode);

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
      {/* BUTTON */}
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
        <Ionicons name="scan-outline" size={24} color="#333" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={cameraVisible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.container}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          {/* DARK OVERLAY */}
          <View style={styles.overlayMask} />

          {/* SCAN FRAME */}
          <View style={styles.scanFrame}>
            <View style={styles.scanBox} />
            <Text style={styles.scanText}>
              Coloca el código dentro del marco
            </Text>
          </View>

          {/* LOADING */}
          {isLoading && (
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>Buscando producto...</Text>
            </View>
          )}

          {/* BOTTOM SHEET */}
          <View style={styles.bottomSheet}>
            {food ? (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primary]}
                  onPress={() => navToItem(food)}
                >
                  <Text style={styles.actionText}>Ver producto</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setBarcode(null);
                    setScanned(false);
                  }}
                >
                  <Text style={styles.actionText}>Escanear otro</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={toggleCameraFacing}
                >
                  <Text style={styles.actionText}>Cambiar cámara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.danger]}
                  onPress={closeScanner}
                >
                  <Text style={styles.actionText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    height: 52,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#fff",
    elevation: 3,
  },

  container: {
    flex: 1,
  },

  overlayMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  scanFrame: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    alignItems: "center",
  },

  scanBox: {
    width: 240,
    height: 160,
    borderWidth: 2,
    borderColor: "#00E676",
    borderRadius: 16,
  },

  scanText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
    opacity: 0.8,
  },

  statusPill: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusText: {
    color: "#fff",
    fontWeight: "600",
  },

  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },

  actionButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#2C2C2C",
    alignItems: "center",
  },

  primary: {
    backgroundColor: "#1B8D43",
  },

  danger: {
    backgroundColor: "#D32F2F",
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
