import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Items } from '../screens/items';
import { Lists } from '../screens/lists';

const Stack = createNativeStackNavigator();

export const ShoppingListStack = () => {
  return (
    <Stack.Navigator initialRouteName="Lists">
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Screen name="Items" component={Items} />
    </Stack.Navigator>
  );
};
