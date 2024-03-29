import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import axios from 'axios';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import Map from './src/components/Map';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from './src/context/Context';

import HomeScreen from './src/screens/HomeScreen';
import DirectionsScreen from './src/screens/DirectionsScreen';
import SecondScreen from './src/screens/SecondScreen';
import ReserveScreen from './src/screens/ReserveScreen';
import TripsScreen from './src/screens/TripsScreen';

    // let url = 'https://image.maps.api.here.com/mia/1.6/routing'
    //
    // const params = {
    //   app_id: 'ODTCWA5mVtf7qQ8cuAir',
    //   app_code: 'Bd6cPwZ06DL_15p_5NGBMw',
    //   waypoint0: '40.7499714,-73.9979574',
    //   waypoint1: '40.7456827,-73.9954344',
    //   poix0: '40.7499714,-73.9979574;white;white;11;.',
    //   poix1: '40.7456827,-73.9954344;red;red;11;.',
    //   lc: '1652B4',
    //   lw: '6',
    //   t: '0',
    //   ppi: '320',
    //   w: '395',
    //   h: '350',
    // }
    //
    // axios.get(url, { params })
    //     .then((res) => console.log(res.request.responseURL))
    //     .catch(err => console.log(err));


const directionsFlow = createStackNavigator({
  Home: HomeScreen,
  Directions: DirectionsScreen
});

const reserveFlow = createStackNavigator({
  List: SecondScreen,
  Reserve: ReserveScreen
});

const mainFlow = createBottomTabNavigator({
  Map: directionsFlow,
  Reserve: reserveFlow,

});

mainFlow.navigationOptions = () => {
  return {
    header: null,
  };
};
reserveFlow.navigationOptions = () => {
  return {
    tabBarIcon: <FontAwesome name="th-list" size={18} />
  };
};

directionsFlow.navigationOptions = () => {
  return {
    tabBarIcon: <MaterialCommunityIcons name="home-map-marker" size={25} />
  };
};

const stackNavigator = createStackNavigator({
  mainFlow
});

const App = createAppContainer(stackNavigator);


export default () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
}
