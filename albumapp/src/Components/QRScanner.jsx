import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
// import { BarCodeScanner } from "expo-barcode-scanner";r

export default function QRScanner() {
  const [hasPermition, setHasPermition] = useState(null);
  const [scanned, setScanned] = useState(false);

  return (
    <View>
      <Text>QRScanner</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
