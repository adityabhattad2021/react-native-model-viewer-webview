import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

import {
  ModelViewerWebView,
  type ModelViewerStatus,
} from "react-native-model-viewer-webview";

const REMOTE_MODEL =
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

export default function App() {
  const [status, setStatus] = useState("Loading model...");

  function handleStatus(nextStatus: ModelViewerStatus) {
    setStatus(nextStatus.message ?? nextStatus.type);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          React Native Model Viewer WebView
        </Text>
        <ModelViewerWebView
          modelSource={REMOTE_MODEL}
          onStatus={handleStatus}
          style={{ flex: 1, minHeight: 360 }}
          htmlOptions={{
            autoRotate: true,
            cameraControls: true,
            cameraOrbit: "0deg 65deg 3m",
            exposure: 1,
            shadowIntensity: 0.4,
          }}
        />
        <Text>{status}</Text>
      </View>
    </SafeAreaView>
  );
}
