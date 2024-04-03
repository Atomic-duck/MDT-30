import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';

import config from "../../config";
import WeatherTab from './WeatherTab';
import FloodTab from './FloodTab';
import SubscribeRouteContainer from './SubscribeRouteContainer';

interface SubscribeRouteFooterProps {

}

const SubscribeRouteFooter: React.FC<SubscribeRouteFooterProps> = ({ }) => {
   const [footerOpen, setFooterOpen] = useState(false); // State to manage footer visibility

   useEffect(() => {
      fetchSubscribeRoutes();
   }, [])

   const fetchSubscribeRoutes = async () => {

   }

   // Function to toggle footer visibility
   const toggleFooter = () => {
      setFooterOpen(!footerOpen);
   }

   const showSubscribeRoute = () => {
      console.log("subscribe route")
   }

   return (
      <View style={styles.infoContainer}>
         <View style={styles.footerHeader} >
            <Text >Danh sách theo dõi</Text>
            <TouchableOpacity
               onPress={toggleFooter}
            >
               <Text style={styles.footerHeaderText}>{footerOpen ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
         </View>
         {
            footerOpen && (
               <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.tabContent}>
                  <TouchableOpacity onPress={showSubscribeRoute}>
                     <SubscribeRouteContainer
                        // key={`route-${index}`}
                        routeInfo={{}}
                     />
                  </TouchableOpacity>
               </ScrollView >
            )
         }

      </View>
   );
}

export default SubscribeRouteFooter;

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
      justifyContent: 'space-between',
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
   tabText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   },
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
});

