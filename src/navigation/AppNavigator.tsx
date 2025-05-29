import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateHabitScreen } from '../screens/CreateHabitScreen';
import { HabitDetailScreen } from '../screens/HabitDetailScreen';
import { EditHabitScreen } from '../screens/EditHabitScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { WidgetConfigScreen } from '../screens/WidgetConfigScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="EditHabit" component={EditHabitScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="WidgetConfig" component={WidgetConfigScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};