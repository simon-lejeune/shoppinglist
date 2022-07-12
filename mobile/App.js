import { useAppState } from '@app/hooks/useAppState';
import { useOnlineManager } from '@app/hooks/useOnlineManager';
import { ShoppingListStack } from '@app/navigation';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
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

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <PaperProvider>
          <ShoppingListStack />
        </PaperProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
