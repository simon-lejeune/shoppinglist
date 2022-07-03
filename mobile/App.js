import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Lists } from './screens/lists';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator initialRouteName="Lists">
          <Stack.Screen name="Lists" component={Lists} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
