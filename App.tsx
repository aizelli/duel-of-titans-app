import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from './src/views/loginScreen';
import RegisterScreen from './src/views/registerScreen';
import CharacterListScreen from 'src/views/characterListScreen';
import characterDetailsScreen from 'src/views/characterDetailsScreen';
import CharacterStatusScreen from 'src/views/characterStatusScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CharactersList: undefined;
  CharacterDetails: undefined;
  CharacterStatus:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CharactersList" component={CharacterListScreen} />
        <Stack.Screen name="CharacterDetails" component={characterDetailsScreen} />
        <Stack.Screen name="CharacterStatus" component={CharacterStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
