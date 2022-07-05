import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { Items } from './screens/items';
import { Lists } from './screens/lists';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator initialRouteName="Lists">
          <Stack.Screen name="Lists" component={Lists} />
          <Stack.Screen name="Items" component={Items} />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
