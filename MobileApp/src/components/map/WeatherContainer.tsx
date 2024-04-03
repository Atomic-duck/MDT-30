import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styled from "styled-components/native";

interface WeatherContainerProps {
   weatherInfo: any;
}

const WeatherContainer: React.FC<WeatherContainerProps> = ({ weatherInfo }) => {
   const timestampToTimeString = (timestampInSeconds: number): string => {
      const date = new Date(timestampInSeconds * 1000); // Convert seconds to milliseconds
      const hours = date.getHours().toString().padStart(2, '0'); // Get hours (in 24-hour format) and pad with leading zero if needed
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed
      return `${hours}:${minutes}`;
   }

   return (
      <View style={styles.weatherInfo}>
         <View style={styles.iconContainer}>
            <Image
               source={{
                  uri: `http://openweathermap.org/img/wn/${weatherInfo.data[0].weather[0].icon}@2x.png`,
               }}
               style={styles.weatherIcon}

               resizeMode={"contain"} // cover or contain its upto you view look
            />
            {/* Time */}
            <Text style={styles.timeText}>{timestampToTimeString(weatherInfo.data[0].dt)}</Text>
         </View>
         <View style={styles.infoContainer}>
            {/* Temperature */}
            <Text style={styles.infoText}>Temp: {weatherInfo.data[0].temp}°C</Text>
            {/* Wind Speed */}
            <Text style={styles.infoText}>Wind: {weatherInfo.data[0].wind_speed}m/s</Text>
            {/* Wind Speed */}
            <Text style={styles.infoText}>Wind: {weatherInfo.data[0].wind_speed}m/s</Text>
            {/* Wind Speed */}
            <Text style={styles.infoText}>Wind: {weatherInfo.data[0].wind_speed}m/s</Text>
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
      padding: 5
   },
   iconContainer: {
      flex: 0.5,
      alignItems: 'center',
      justifyContent: 'center',
   },
   timeText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 5,
   },
   infoContainer: {
      flexDirection: 'row', // Display content in a row
      flexWrap: 'wrap', // Wrap content if it exceeds container width
      flex: 2,
      paddingHorizontal: 10,
      justifyContent: 'flex-start',
      columnGap: 30
   },
   infoText: {
      fontSize: 14,
      marginBottom: 5,
   },
   weatherIcon: {
      marginVertical: -8,
      width: 50,
      height: 50,
   }
});

export default WeatherContainer;
