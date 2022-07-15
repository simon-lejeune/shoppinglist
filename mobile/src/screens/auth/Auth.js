import { Error } from '@app/components';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '@app/config';
import { AuthContext } from '@app/context';
import * as AuthSession from 'expo-auth-session';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

const auth0ClientId = AUTH0_CLIENT_ID;
const authorizationEndpoint = 'https://dev-k0w73c7b.eu.auth0.com/authorize'; // FIXME use env

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export const Auth = () => {
  console.log("redirectUri", redirectUri);
  const { signIn } = React.useContext(AuthContext);
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      responseType: 'id_token', // id_token will return a JWT token
      scopes: ['openid', 'profile', 'email'], // retrieve the user's profile
      extraParams: {
        nonce: 'nonce', // ideally, this will be a random value
      },
    },
    { authorizationEndpoint }
  );

  React.useEffect(() => {
    if (result) {
      if (result.error) {
        return (
          <Error>{`Authentication error: ${
            result.params.error_description || 'something went wrong'
          }`}</Error>
        );
      }
      if (result.type === 'success') {
        const jwtToken = result.params.id_token;
        signIn(jwtToken);
      } else {
        console.log('result type not success', result);
      }
    }
  }, [result]);

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => promptAsync({ useProxy })}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
