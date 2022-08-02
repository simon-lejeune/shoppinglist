import { Loading } from '@app/components';
import { CustomNavigationBar } from '@app/components/CustomNavigationBar';
import { AuthContext, AuthReducer, AuthInitialState } from '@app/context';
import { Auth } from '@app/screens/auth';
import { Items } from '@app/screens/items';
import { Lists } from '@app/screens/lists';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

export const ShoppingListStack = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [state, dispatch] = React.useReducer(AuthReducer, AuthInitialState);
  const authContext = React.useMemo(
    () => ({
      state,
      dispatch,
      signIn: async (userToken) => {
        if (Platform.OS === 'web') {
          window.localStorage.setItem('userToken', userToken);
        } else {
          await SecureStore.setItemAsync('userToken', userToken);
        }
        dispatch({ type: 'SIGN_IN', token: userToken });
      },
      signOut: async () => {
        if (Platform.OS === 'web') {
          window.localStorage.removeItem('userToken');
        } else {
          await SecureStore.deleteItemAsync('userToken');
        }
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [dispatch, state.userToken]
  );

  // Try to restore the last userToken when loading the app.
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        if (Platform.OS === 'web') {
          userToken = window.localStorage.getItem('userToken');
        } else {
          userToken = await SecureStore.getItemAsync('userToken');
        }
      } catch (e) {
        console.error(e);
        return;
      }
      if (userToken !== null) {
        dispatch({ type: 'SIGN_IN', token: userToken });
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator
        initialRouteName="Lists"
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}>
        {state.userToken == null ? (
          <Stack.Screen
            name="Auth"
            component={Auth}
            options={{
              title: 'Sign in',
              animationTypeForReplace: state.userToken === null ? 'pop' : 'push',
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Lists" component={Lists} />
            <Stack.Screen name="Items" component={Items} />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};
