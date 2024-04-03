import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from './screens/Map';
import LocationSearch from './components/map/LocationSearch';
import SubscribeRouteScreen from './screens/SubscribeRouteScreen';


const Stack = createNativeStackNavigator();

const MapStackNavigator = () => {
   return (
      <Stack.Navigator>
         <Stack.Group>
            <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
         </Stack.Group>
         <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="LocationSearch" component={LocationSearch} options={{
               gestureDirection: 'vertical',
               headerShown: false
            }} />
            <Stack.Screen name="SubscribeRouteScreen" component={SubscribeRouteScreen} options={{
               title: "Theo dõi tuyến đường"
            }} />
         </Stack.Group>
      </Stack.Navigator>
   );
};

export default MapStackNavigator;
