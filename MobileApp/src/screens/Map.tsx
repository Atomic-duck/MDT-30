import React, { useRef, useState, useEffect } from 'react';
import { View, Image, SafeAreaView, StyleSheet, PermissionsAndroid, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Feature } from '@turf/helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';

import AnnotationWithImage from "../components/map/AnnotationWithImage"
import WayPointsHeader from "../components/map/WayPointsHeader"
import InfoFooter from '../components/map/InfoFooter';
import cameraImg from '../images/camera_green.png'
import CameraView from '../components/map/CameraView';
import Waypoint from '../components/map/interface/Waypoint';
import Geolocation from 'react-native-geolocation-service';
import SubscribeRouteFooter from '../components/map/SubcribeRouteFooter';

MapboxGL.setConnected(true);
MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken("pk.eyJ1IjoiYXRvbWljZHVjayIsImEiOiJjbG53b2t4b24wOHBiMmxwY2h2anJrNWkxIn0.FXiRCSKZGDHWSWZiIs_ZUw");
// Geolocation.setRNConfiguration({
//    skipPermissionRequests: false,
//    authorizationLevel: 'auto',
// });

interface MapProps {
   navigation: any; // You should replace 'any' with the proper navigation type
   route: any; // Replace 'any' with the proper route type
}

const routeProfiles = [
   { id: 'walking', label: 'Walking', icon: 'walking' },
   { id: 'cycling', label: 'Cylcing', icon: 'bicycle' },
   { id: 'driving', label: 'Driving', icon: 'car' },
];

// Function to get permission for location
const requestLocationPermission = async () => {
   try {
      const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
         },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
         console.log('You can use Geolocation');
         return true;
      } else {
         console.log('You cannot use Geolocation');
         return false;
      }
   } catch (err) {
      return false;
   }
};

const Map: React.FC<MapProps> = ({ navigation, route }) => {
   const mapRef = useRef(null); // Reference to the MapView component
   const camRef = useRef<MapboxGL.Camera>(null);
   const [location, setLocation] = useState<[number, number] | null>(null); // State to store current coordinates
   const [waypoints, setWaypoints] = useState<(Waypoint | null)[]>([null, null]); // Store waypoints
   const [routeDirections, setRouteDirections] = useState<any | null>(null); // State to store route directions
   const [selectedRouteProfile, setselectedRouteProfile] = useState<string>('walking'); // State to store selected route profile
   const [loading, setLoading] = useState(false); // State to manage loading indicator
   const [showWeatherIcons, setShowWeatherIcons] = useState(false); // State to manage weather icon display
   const [weatherList, setWeatherList] = useState<any[]>([]);
   const [showCameraIcons, setShowCameraIcons] = useState(false); // State to manage camera icon display
   const [cameraList, setCameraList] = useState<any[]>([]);
   const [showCameraId, setShowCameraId] = useState<{} | null>(null); // State to manage camera detail display


   const getLocation = () => {
      const result = requestLocationPermission();
      result.then(res => {
         if (res) {
            Geolocation.getCurrentPosition(
               position => {
                  console.log(position);
                  setLocation([position.coords.longitude, position.coords.latitude]);
               },
               error => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                  setLocation(null);
               },
               { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
         }
      });
      console.log(location);
   };

   useEffect(() => {
      getLocation();
   }, [])

   useEffect(() => {
      moveToUserLocation();
   }, [location])

   useEffect(() => {
      if (waypoints.length >= 2 && !haveNullPoint()) {
         fetchRoute();
         zoomToWaypoints();
      }
      if (waypoints.length <= 2 && haveNullPoint()) {
         setCameraList([]);
         setWeatherList([]);
         setRouteDirections(null);
      }
   }, [waypoints])

   useEffect(() => {
      if (routeDirections) {
         fetchCamera();
      }
   }, [routeDirections])

   const moveToUserLocation = () => {
      camRef.current?.setCamera({
         centerCoordinate: location ? location : [106.8052683, 10.8785317],
         zoomLevel: 14
      })
   }
   const fetchCamera = async () => {
      setLoading(true); // Set loading state
      const url = `http://127.0.0.1:8080/route/cameras`;
      const coordinates = routeDirections.routerFeature.features[0].geometry.coordinates;

      try {
         let response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(coordinates)
         });
         let cameras = await response.json();

         console.log(cameras.length)
         setCameraList(cameras);
         setLoading(false); // Clear loading state
      } catch (error) {
         setLoading(false); // Clear loading state
         console.error('Error fetching cameras:', error);
      }
   }

   const fetchRoute = async () => {
      setLoading(true); // Set loading state
      const routeProfile = selectedRouteProfile;
      const url = `http://127.0.0.1:8080/route`;

      try {
         let response = await fetch('http://127.0.0.1:8080/route', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ waypoints: waypoints.filter(waypoint => waypoint !== null).map(waypoint => waypoint.coordinates) })
         });
         let json = await response.json();

         const coordinates = json.routes[0].geometry.coordinates;
         if (coordinates.length) {
            const newRouteDirections = {
               routerFeature: makeRouterFeature(coordinates),
               durations: json.routes[0].legs[0].annotation.duration,   // s
               speeds: json.routes[0].legs[0].annotation.speed,      // m/s
            }

            setRouteDirections(newRouteDirections); // Set route directions
         }
         setLoading(false); // Clear loading state
      } catch (error) {
         setLoading(false); // Clear loading state
         console.error('Error fetching route:', error);
      }
   }

   const makeRouterFeature = (coordinates: [number, number][]): any => {
      return {
         type: 'FeatureCollection',
         features: [{
            type: 'Feature',
            properties: {},
            geometry: {
               type: 'LineString',
               coordinates: coordinates,
            },
         }],
      };
   }

   const haveNullPoint = (): boolean => {
      return waypoints.some(waypoint => waypoint === null);
   }

   // Function to handle map press event
   const handleMapPress = async (feature: Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>) => {
      const featurePoint = feature as Feature<GeoJSON.Point>;
      console.log(featurePoint.geometry.coordinates);

      let i = waypoints.length - 1;
      while (i >= 0 && waypoints[i] == null) {
         i--;
      }

      let addedWaypoint = {
         coordinates: featurePoint.geometry.coordinates,
         name: `${featurePoint.geometry.coordinates[0]}, ${featurePoint.geometry.coordinates[1]}`
      }

      if (i == waypoints.length - 1) {
         setWaypoints([...waypoints, addedWaypoint]);
      }
      else {
         let newWaypoints = [...waypoints.slice(0, i + 1), addedWaypoint];
         setWaypoints(newWaypoints.length < 2 ? [...newWaypoints, null] : newWaypoints);
      }
   }

   // Function to handle drag end event
   const handleDragEnd = (event: any) => {
      const { properties, geometry } = event;

      // Update the coordinates of the dragged point
      const updatedWaypoints = waypoints.map((waypoint, index) => {
         if (`waypoint-${index}` === properties.id) {
            return {
               coordinates: geometry.coordinates,
               name: `${geometry.coordinates[0]}, ${geometry.coordinates[1]}`
            };
         }
         return waypoint;
      });

      setWaypoints(updatedWaypoints);
   }

   const handleOnPressCamera = (camId: string, cameraName: string) => {
      setShowCameraId({
         camId: camId,
         cameraName: cameraName
      }); // Show camera detail view
   };

   const onSearchLocation = (name: string, index: number, allowCurrentLocation: boolean) => {
      navigation.navigate('LocationSearch', {
         name,
         index,
         current: location,
         allowCurrentLocation
      });
   };

   const navigateToSubscribeScreen = () => {
      navigation.navigate('SubscribeRouteScreen');
   }

   // Function to zoom the camera to capture all waypoints
   const zoomToWaypoints = () => {
      const coordinates = waypoints
         .filter(waypoint => waypoint !== null)
         .map(waypoint => waypoint!.coordinates);

      if (coordinates.length === 0) return; // No waypoints

      const bbox = coordinates.reduce((acc, coord) => {
         return [
            [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
            [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
         ];
      }, [[Infinity, Infinity], [-Infinity, -Infinity]]);

      console.log(bbox)
      camRef.current?.fitBounds(bbox[0], bbox[1], 130, 1000);
   }

   return (
      <SafeAreaView style={styles.container}>
         <WayPointsHeader location={location} route={route} waypoints={waypoints} setWaypoints={setWaypoints} onSearchLocation={onSearchLocation} />
         <MapboxGL.MapView
            style={styles.map}
            zoomEnabled
            rotateEnabled={false}
            compassEnabled
            onPress={handleMapPress} // Attach onPress event handler
            ref={mapRef} // Set reference to MapView component
         >
            <MapboxGL.Camera
               ref={camRef}
            />
            {routeDirections && (
               <MapboxGL.ShapeSource id="route" shape={routeDirections.routerFeature}>
                  <MapboxGL.LineLayer
                     id="routeLine"
                     style={{
                        lineColor: 'blue',
                        lineWidth: 4,
                     }}
                  />
               </MapboxGL.ShapeSource>
            )}
            {
               showWeatherIcons && (
                  weatherList?.map((weatherInfo, index) => (
                     <MapboxGL.MarkerView
                        key={`weather-${index}`}
                        coordinate={[weatherInfo.lon, weatherInfo.lat]}
                        anchor={{ x: 1, y: 1 }}
                     >
                        <View style={styles.weatherMapContainer}>
                           <Image
                              source={{
                                 uri: `http://openweathermap.org/img/wn/${weatherInfo.data[0].weather[0].icon}@2x.png`,
                              }}
                              style={styles.weatherIcon}
                              resizeMode={"contain"} // cover or contain its upto you view look
                           />
                           <Text style={styles.iconText}>{index + 1}</Text>
                        </View>
                     </MapboxGL.MarkerView>
                  ))
               )
            }
            {
               showCameraIcons && (
                  cameraList?.map(((camera, index) => {
                     console.log(camera.display_name);
                     return (
                        <MapboxGL.MarkerView
                           key={`camera-${index}`}
                           coordinate={[camera.lon, camera.lat]}
                           anchor={{ x: 0.5, y: 0.5 }}
                        >
                           <TouchableOpacity onPress={() => handleOnPressCamera(camera.camId, camera.display_name)}>
                              <Image
                                 source={cameraImg}
                                 resizeMode={"contain"} // cover or contain its upto you view look
                              />
                           </TouchableOpacity>
                        </MapboxGL.MarkerView>
                     )
                  }))
               )
            }
            {
               waypoints.map((waypoint, index) => {
                  if (waypoint == null) return null;
                  const title = `Lon: ${waypoint.coordinates[0]} Lat: ${waypoint.coordinates[1]}`;
                  const id = `waypoint-${index}`;
                  if (waypoint.coordinates[0] == location[0] && waypoint.coordinates[1] == location[1]) return null;

                  return (
                     <AnnotationWithImage
                        key={id}
                        id={id}
                        coordinate={waypoint.coordinates}
                        title={title}
                        onDragEnd={handleDragEnd}
                     />
                  )
               })
            }
            <MapboxGL.UserLocation minDisplacement={14} />
         </MapboxGL.MapView>

         <View style={styles.panelContainer}>
            <TouchableOpacity onPress={moveToUserLocation}>
               <Icon name="crosshairs" size={30} />
            </TouchableOpacity>
            {
               routeDirections && (
                  <TouchableOpacity onPress={navigateToSubscribeScreen}>
                     <Icon name="bell" size={30} />
                  </TouchableOpacity>
               )
            }
         </View>

         {showCameraId != null && (
            <CameraView camInfo={showCameraId} setShowCameraId={setShowCameraId} />
         )}
         {routeDirections ? (
            <InfoFooter routeDirections={routeDirections} showWeatherIcons={showWeatherIcons} setShowWeatherIcons={setShowWeatherIcons} weatherList={weatherList} setWeatherList={setWeatherList} showCameraIcons={showCameraIcons} setShowCameraIcons={setShowCameraIcons} />
         ) : (
            <SubscribeRouteFooter />
         )
         }
         {loading ? (
            <ActivityIndicator
               size="large"
               color="white"
               style={styles.loadingIndicator}
            />
         ) : null
         }
      </SafeAreaView>
   );
}

export default Map;

const styles = StyleSheet.create({
   container: {
      height: "100%",
      width: "100%",
   },
   map: {
      flex: 2,
   },
   loadingIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 2,
   },
   weatherMapContainer: {
      flexDirection: "column",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center"
   },
   weatherIcon: {
      width: 60,
      height: 60,
   },
   iconText: {
      marginTop: -15,
      fontSize: 16
   },
   panelContainer: {
      position: 'absolute',
      top: 300,
      right: 5,
      flexDirection: 'column',
      gap: 10,
      paddingHorizontal: 5,
      paddingVertical: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10
   }
});
