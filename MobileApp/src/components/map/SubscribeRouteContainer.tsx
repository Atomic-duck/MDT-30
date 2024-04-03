import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styled from "styled-components/native";

interface SubsctibeRouteContainerProps {
   routeInfo: any;
}

const SubsctibeRouteContainer: React.FC<SubsctibeRouteContainerProps> = ({ routeInfo }) => {
   const timestampToTimeString = (timestampInSeconds: number): string => {
      const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds
      const hours = date.getHours().toString().padStart(2, '0'); // Get hours (in 24-hour format) and pad with leading zero if needed
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed
      return `${hours}:${minutes}`;
   }

   return (
      <View style={styles.weatherInfo}>
         <View style={styles.iconContainer}>
            <View style={styles.routeIcon}>
               <Icon name="route" size={30} />
            </View>
            {/* Time */}
            <View style={styles.infoContainer}>
               <Text>Route 1 - 15km</Text>
               <Text>Thông báo: 17h30 - 8h</Text>
            </View>
         </View>
         <View style={styles.addressContainer}>
            <Text style={styles.infoText}>Từ: KTX khu A</Text>
            <Text style={styles.infoText}>Đến: Bùi Viện</Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   weatherInfo: {
      flexDirection: 'row',
      backgroundColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 8,
      paddingVertical: 10,
      gap: 20
   },
   routeIcon: {
      width: 30,
   },
   iconContainer: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   timeText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 5,
   },
   infoContainer: {
      marginLeft: 8,
   },
   addressContainer: {

   },
   infoText: {
      fontSize: 14,
   },
});

export default SubsctibeRouteContainer;
