import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';

import config from "../../config";
import WeatherTab from './WeatherTab';
import FloodTab from './FloodTab';

interface InfoFooterProps {
   routeDirections: any;
   showWeatherIcons: boolean;
   setShowWeatherIcons: any;
   weatherList: any[];
   setWeatherList: any;
   showCameraIcons: boolean;
   setShowCameraIcons: any;
}

interface WeatherFetchInfo {
   location: number[],
   timestamp: number
}

enum TabType {
   WEATHER = "Thời tiết",
   FLOOD = "Ngập lụt",
   FOLLOW = "Theo dõi"
}

const InfoFooter: React.FC<InfoFooterProps> = ({ routeDirections, showWeatherIcons, setShowWeatherIcons, weatherList, setWeatherList, showCameraIcons, setShowCameraIcons }) => {
   const [footerOpen, setFooterOpen] = useState(false); // State to manage footer visibility
   const [activeTab, setActiveTab] = useState<TabType>(TabType.WEATHER); // State to manage active tab
   const weatherDistance = 2000; // m

   useEffect(() => {
      let weatherLocations = getWeatherLocations();

      const fetchWeatherData = async () => {
         console.log("fetch weather data")
         const promises = weatherLocations.map(async (locationInfo) => {
            const { location, timestamp } = locationInfo;
            const [longitude, latitude] = location;

            const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${Math.floor(timestamp / 1000)}&units=metric&appid=${config.API_KEY}`;

            try {
               const response = await fetch(apiUrl);
               const data = await response.json();
               return data;
            } catch (error) {
               console.error('Error fetching weather data:', error);
               return null;
            }
         });

         Promise.all(promises).then((results) => {
            const filteredResults = results.filter((result) => result !== null);
            setWeatherList(filteredResults);
         });
      };

      fetchWeatherData();
   }, [routeDirections])

   const getWeatherLocations = (): WeatherFetchInfo[] => {
      let coordinates = routeDirections.routerFeature.features[0].geometry.coordinates;
      let weatherLocations: WeatherFetchInfo[] = [];
      let distance = 0;
      let duration = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
         distance += routeDirections.durations[i] * routeDirections.speeds[i];
         duration += routeDirections.durations[i];
         if (distance > weatherDistance) {
            weatherLocations.push({
               location: coordinates[i + 1],
               timestamp: Date.now() + duration * 1000
            });
            distance = 0;
         }
      }

      return weatherLocations;
   }

   // Function to toggle footer visibility
   const toggleFooter = () => {
      setFooterOpen(!footerOpen);
   }

   // Function to handle tab press
   const handleTabPress = (tab: TabType) => {
      if (footerOpen) {
         setActiveTab(tab);
      }
   };

   const renderContent = () => {
      switch (activeTab) {
         case TabType.WEATHER:
            return (
               <WeatherTab showWeatherIcons={showWeatherIcons} setShowWeatherIcons={setShowWeatherIcons} weatherList={weatherList} />
            );
         case TabType.FLOOD:
            return (
               <FloodTab showCameraIcons={showCameraIcons} setShowCameraIcons={setShowCameraIcons} />
            );
         case TabType.FOLLOW:
            return (
               <View style={styles.tabContent}>
                  <Text>Follow Tab Content</Text>
               </View>
            );
         default:
            return null;
      }
   }

   return (
      <View style={styles.infoContainer}>
         <View style={styles.footerHeader} >
            <TouchableOpacity
               style={[
                  styles.tab,
                  activeTab === TabType.WEATHER && styles.activeTab // Apply active tab style
               ]}
               onPress={() => handleTabPress(TabType.WEATHER)}
            >
               <Text style={styles.tabText}>{TabType.WEATHER.toString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[
                  styles.tab,
                  activeTab === TabType.FLOOD && styles.activeTab // Apply active tab style
               ]}
               onPress={() => handleTabPress(TabType.FLOOD)}
            >
               <Text style={styles.tabText}>{TabType.FLOOD.toString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[
                  styles.tab,
                  activeTab === TabType.FOLLOW && styles.activeTab // Apply active tab style
               ]}
               onPress={() => handleTabPress(TabType.FOLLOW)}
            >
               <Text style={styles.tabText}>{TabType.FOLLOW.toString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.tab}
               onPress={toggleFooter}
            >
               <Text style={styles.footerHeaderText}>{footerOpen ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
         </View>

         {
            footerOpen && renderContent()
         }
      </View>
   );
}

export default InfoFooter;

const styles = StyleSheet.create({
   infoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
   },
   footerHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
   },
   footerHeaderText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
   },
   tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
   },
   activeTab: {
      backgroundColor: 'white', // Active tab background color
   },
   tabText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   },
});

