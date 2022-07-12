import { ShoppingListStack } from '@app/navigation';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <ShoppingListStack />
      </PaperProvider>
    </NavigationContainer>
  );
}
