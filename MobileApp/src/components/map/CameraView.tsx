import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native';

interface CameraViewProps {
   camInfo: any;
   setShowCameraId: any;
}

const CameraView: React.FC<CameraViewProps> = ({ camInfo, setShowCameraId }) => {
   // const [reloadCounter, setReloadCounter] = useState(0); // Counter to trigger image reload

   // useEffect(() => {
   //    const timer = setInterval(() => {
   //       console.log("reload")
   //       // Increment the reload counter every 10 seconds
   //       setReloadCounter(prevCounter => prevCounter + 1);
   //    }, 1000); // 10 seconds in milliseconds

   //    // Clean up the timer on component unmount
   //    return () => clearInterval(timer);
   // }, []);

   return (
      <View style={styles.cameraDetailView}>
         <View style={styles.cameraDetailHeader}>
            <Text>{camInfo.cameraName}</Text>
            <TouchableOpacity onPress={() => setShowCameraId(null)}>
               <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
         </View>
         <View style={styles.cameraDetailContent}>
            <Image
               // key={reloadCounter} // Use reloadCounter as the key to trigger image reload
               source={{ uri: `http://giaothong.hochiminhcity.gov.vn/render/ImageHandler.ashx?id=${camInfo.camId}` }}
               style={styles.cameraImage}
               resizeMode="contain"
            />
         </View>
      </View>
   );
}

export default CameraView;

const styles = StyleSheet.create({
   // Style for camera detail view
   cameraDetailView: {
      position: 'absolute',
      backgroundColor: 'white',
      top: '30%',
      left: 0,
      right: 0,
      paddingHorizontal: 2,
      marginLeft: "1%",
      width: "98%",
      height: 250,
      zIndex: 3,
      borderRadius: 5,
   },
   cameraDetailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: "100%",
      padding: 5
   },
   // Style for close button in camera detail view
   closeButton: {
      color: 'blue',
   },
   cameraDetailContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: "100%",
      paddingBottom: 10,
   },
   cameraImage: {
      width: '100%',
      height: '100%',
   },
});
