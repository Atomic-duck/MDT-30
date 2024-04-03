import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/BottomTabNavigator';
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: "889362516346-pqa1n413lqari1sanliotdn8381v6tqi.apps.googleusercontent.com",
  offlineAccess: false,
});

export default function App() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}