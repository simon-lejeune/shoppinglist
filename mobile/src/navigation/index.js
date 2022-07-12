import { Items } from '@app/screens/items';
import { Lists } from '@app/screens/lists';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export const ShoppingListStack = () => {
  const { colors } = useTheme();
  const headerStyle = {
    backgroundColor: colors.primary,
  };
  const headerTitleStyle = {
    color: '#e9ecf5',
  };

  return (
    <Stack.Navigator initialRouteName="Lists">
      <Stack.Screen name="Lists" component={Lists} options={{ headerStyle, headerTitleStyle }} />
      <Stack.Screen name="Items" component={Items} options={{ headerStyle, headerTitleStyle }} />
    </Stack.Navigator>
  );
};
