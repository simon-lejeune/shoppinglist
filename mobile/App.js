import { useAppState } from '@app/hooks/useAppState';
import { useOnlineManager } from '@app/hooks/useOnlineManager';
import { ShoppingListStack } from '@app/navigation';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, useTheme } from 'react-native-paper';
import { QueryClient, QueryClientProvider, focusManager } from 'react-query';

function onAppStateChange(status) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function App() {
  useOnlineManager();
  useAppState(onAppStateChange);

  const { colors } = useTheme();
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...colors,
      primary: '#993955',
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <ShoppingListStack />
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
