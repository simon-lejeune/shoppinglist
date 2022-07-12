import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { ShoppingListStack } from './navigation';

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <ShoppingListStack />
      </PaperProvider>
    </NavigationContainer>
  );
}
