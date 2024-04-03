import { CheckBox } from '@rneui/base';
import React from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import WeatherContainer from './WeatherContainer';

interface FloodTabProps {
   showCameraIcons: boolean;
   setShowCameraIcons: any;
}

const FloodTab: React.FC<FloodTabProps> = ({ showCameraIcons, setShowCameraIcons }) => {
   // Function to handle checkbox state changes
   const handleCheckboxChange = (value: boolean) => {
      setShowCameraIcons(value);
   };

   return (
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.tabContent}>
         <View style={styles.checkboxContainer}>
            <CheckBox
               checked={showCameraIcons}
               onPress={(e) => handleCheckboxChange(!showCameraIcons)}
               containerStyle={styles.boxContainer}
            />
            <Text>HIển thị Camera</Text>
         </View>
         <View>
            {/* Generate weatherInfo components using mock data */}

         </View>
      </ScrollView >
   );
}

export default FloodTab;

const styles = StyleSheet.create({
   scrollViewContent: {
      justifyContent: 'flex-start',
      flexGrow: 1,
   },
   checkboxContainer: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      marginBottom: 10,
   },
   boxContainer: {
      padding: 0,
   },
   tabContent: {
      paddingVertical: 5,
      height: 200,
   }
});
