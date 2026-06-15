import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/store/auth.store';
import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import CheckInScreen from './src/screens/CheckInScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const { isAuthenticated, restoreSession } = useAuthStore();

  useEffect(() => { restoreSession(); }, []);

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="light" />
        <AuthScreen />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#0d0d12', borderTopColor: '#1e1e2c' },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#444',
        }}
      >
        <Tab.Screen
          name="Talk"
          component={ChatScreen}
          options={{ tabBarLabel: 'Talk' }}
        />
        <Tab.Screen
          name="CheckIn"
          component={CheckInScreen}
          options={{ tabBarLabel: 'Check In' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
