import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import { useAuth } from '../context/AuthContext';
import RegisterFaceScreen from 'screens/admin/RegisterFaceScreen';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import CreateUserScreen from 'screens/admin/CreateUserScreen';
import EditUserScreen from 'screens/admin/EditUserScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import AdminVacationsScreen from 'screens/admin/AdminVacationsScreen';
import AdminAttendanceScreen from 'screens/admin/AdminAttendanceScreen';

import UserHomeScreen from '../screens/user/UserHomeScreen';
import AttendanceScreen from 'screens/user/AttendanceScreen';
import OpenCamera from 'screens/user/OpenCamera';
import AttendanceHistoryScreen from 'screens/user/AttendanceHistoryScreen';
import VacationsScreen from 'screens/user/VacationsScreen';
import ScheduleScreen from 'screens/admin/ScheduleScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : user.rol === 'administrador' ? (
          <>
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            <Stack.Screen name="Users" component={UsersScreen} />
            <Stack.Screen name="CreateUser" component={CreateUserScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
            <Stack.Screen name="RegisterFace" component={RegisterFaceScreen} />
            <Stack.Screen name="AdminVacations" component={AdminVacationsScreen} />
            <Stack.Screen name="AdminAttendance" component={AdminAttendanceScreen} />
            <Stack.Screen name="Schedules" component={ScheduleScreen}/>
            <Stack.Screen name="OpenCamera" component={OpenCamera} />
          </>
        ) : (
          <>
          <Stack.Screen name="UserHome" component={UserHomeScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="OpenCamera" component={OpenCamera} />
          <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
          <Stack.Screen name="Vacations" component={VacationsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}