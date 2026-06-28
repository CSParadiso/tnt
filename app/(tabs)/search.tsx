import { useFoodById } from "@/hooks/useFoods";
import { Foods } from "@/models/foods";
import { buildRoute, ROUTES } from "@/navigation/routes";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  const { data: food, isLoading, error } = useFoodById(barcode);

  const router = useRouter();

  const navToItem = (item: Foods) => {
    router.push(buildRoute(ROUTES.FOODS, { id: item.code }));
  };

  useEffect(() => {
    if (food) {
      console.log("### Food:", food);
    }
  }, [food]);

  useEffect(() => {
    if (!isLoading && scanned) {
      const timer = setTimeout(() => {
        setScanned(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, scanned]);

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Cambiar Cámara</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Buscando producto...</Text>
        </View>
      )}

      {error && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Error al buscar el producto.</Text>
        </View>
      )}

      {food && (
        <View style={styles.productContainer}>
          <TouchableOpacity
            style={styles.productButton}
            onPress={navToItem.bind(null, food)}
          >
            <Text style={styles.productButtonText}>Ver producto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  overlayText: {
    color: "white",
    fontWeight: "600",
  },
  productContainer: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
  },

  productButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },

  productButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
