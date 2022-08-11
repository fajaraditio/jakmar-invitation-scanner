import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as apiConfig from './apiConfig.json'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const res = await fetch(apiConfig.url + '/send?' + new URLSearchParams({
      id: data
    }))
      .then(response => response.json())
      .catch((error, response) => {
        console.error(error, response)
      })

    if (res.status === 'ok') {
      Alert.alert('QR Undangan Tervalidasi', 'Atas Nama ' + res.data.name + '\n\ndari ' + res.data.company)
    }
    else {
      Alert.alert('QR Undangan Tidak Valid', 'Silakan scan ulang atau hubungi IT helpdesk')
    }
  };

  if (hasPermission === null) {
    return <SafeAreaView style={{ flex: 1, padding: 10 }}><Text>Silakan nyalakan Izin Akses untuk Kamera...</Text></SafeAreaView>;
  }
  if (hasPermission === false) {
    return <SafeAreaView style={{ flex: 1, padding: 10 }}><Text>Aplikasi tidak memiliki Izin Akses untuk Kamera</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Scan QR Undangan
        </Text>
        <Text style={styles.subtitle}>
          The Jakarta Marathon 2022
        </Text>
      </View>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ width: '100%', height: 500 }}
        />
        {scanned &&
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.scanButton}>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontWeight: 'bold' }}>Tap untuk Scan Kembali</Text>
          </TouchableOpacity>}
      </View>
      <View style={styles.footer}>
        <Text style={{ textAlign: 'center', fontSize: 9 }}>
          Made with ❣️ "YoloTech by Socyolo"
        </Text>
      </View>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: 'bold',
    color: '#379bae',
    fontSize: 20,
    paddingBottom: 5
  },
  subtitle: {
    fontWeight: '500',
    fontSize: 15,
    paddingBottom: 5
  },
  scanButton: {
    backgroundColor: '#379bae',
    elevation: 0,
    shadowColor: null,
    shadowOffset: 0,
    padding: 10,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20
  }
});
