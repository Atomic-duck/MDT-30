// Import necessary modules
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import {
   GoogleSignin,
   GoogleSigninButton,
   NativeModuleError,
   statusCodes,
} from '@react-native-google-signin/google-signin';
import type { User } from '@react-native-google-signin/google-signin';

type ErrorWithCode = Error & { code?: string };

type LoginInfo = {
   error?: ErrorWithCode;
   userInfo?: User;
};

interface Props {
   navigation: any,
   route: any,
}

// Define your component
const SubscribeRouteScreen: React.FC<Props> = ({ navigation, route }) => {
   // State to manage the visibility of the login modal
   const [showLoginModal, setShowLoginModal] = useState(false);
   const [loginInfo, setLoginInfo] = useState<LoginInfo>({});

   useEffect(() => {
      // Check if the user is logged in
      const isUserLoggedIn = checkUserLoggedIn(); // Replace with your actual function to check user login status

      if (!isUserLoggedIn) {
         // If the user is not logged in, display the login modal
         setShowLoginModal(true);
      }
   }, []);

   const checkUserLoggedIn = () => {
      return false;
   }

   // Function to handle user login
   const handleLogin = async () => {
      try {
         await GoogleSignin.hasPlayServices();
         const userInfo = await GoogleSignin.signIn();
         setLoginInfo({ userInfo, error: undefined });
         console.log(userInfo)
      } catch (error) {
         const typedError = error as NativeModuleError;
         console.log(error)
         switch (typedError.code) {
            case statusCodes.SIGN_IN_CANCELLED:
               // sign in was cancelled
               Alert.alert('cancelled');
               break;
            case statusCodes.IN_PROGRESS:
               // operation (eg. sign in) already in progress
               Alert.alert('in progress');
               break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
               // android only
               Alert.alert('play services not available or outdated');
               break;
            default:
               Alert.alert('Something went wrong', typedError.toString());
               setLoginInfo({
                  error: typedError,
               });
         }
      }
   };

   // Function to navigate back to the previous screen
   const handleBack = () => {
      navigation.goBack();
   };

   return (
      <View style={styles.container}>
         <TextInput
            placeholder={"Nhập tên thành phố"}
            style={styles.textInput}
         />
         <View style={styles.contentContainer}>
            <View style={styles.field}>
               <Text style={styles.textTitle}>Từ</Text>
               <Text>17h30</Text>
            </View>
            <View style={styles.field}>
               <Text style={styles.textTitle}>Đến</Text>
               <Text>20h30</Text>
            </View>
            <View style={styles.field}>
               <Text style={styles.textTitle}>Lặp lại</Text>
               <Text>Mỗi ngày</Text>
            </View>
         </View>

         {/* Login Modal */}
         <Modal
            visible={showLoginModal}
            animationType='fade'
            transparent={true}
         >
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalText}>Bạn cần đăng nhập để sử dụng tính năng này</Text>
                  {/* Button container */}
                  <View style={styles.buttonContainer}>
                     {/* Back button */}
                     <TouchableOpacity onPress={handleBack}>
                        <Text style={styles.backButton}>Quay lại</Text>
                     </TouchableOpacity>
                     {/* Login button */}
                     {/* <TouchableOpacity onPress={handleLogin}>
                        <Text style={styles.loginButton}>Đăng nhập</Text>
                     </TouchableOpacity> */}
                     <GoogleSigninButton
                        size={GoogleSigninButton.Size.Standard}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={handleLogin}
                     />
                  </View>
               </View>
            </View>
         </Modal>
      </View>
   );
};

// Define your styles
const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
      paddingHorizontal: 15,
      paddingTop: 20
   },
   contentContainer: {

   },
   textInput: {
      height: 50,
      width: "100%",
      backgroundColor: "rgba(200,200,200,0.3)",
      padding: 15,
      marginBottom: 15,
      borderRadius: 10,
      borderStyle: 'solid',
      borderColor: 'black',
      borderWidth: 1,
   },
   field: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10
   },
   textTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: 'black'
   },
   // Modal styles
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: "96%"
   },
   modalText: {
      fontSize: 18,
      marginBottom: 20
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: "100%"
   },
   backButton: {
      fontSize: 16,
      color: 'red'
   },
   loginButton: {
      fontSize: 16,
      color: 'blue'
   }
});

// Export your component
export default SubscribeRouteScreen;
