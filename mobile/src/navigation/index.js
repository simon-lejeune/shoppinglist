import { Items } from '@app/screens/items';
import { Lists } from '@app/screens/lists';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const ShoppingListStack = () => {
  return (
    <Stack.Navigator initialRouteName="Lists">
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Screen name="Items" component={Items} />
    </Stack.Navigator>
  );
};
