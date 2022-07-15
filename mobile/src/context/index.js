import * as React from 'react';

export const AuthContext = React.createContext({});

export const AuthReducer = (prevState, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...prevState,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        userToken: null,
      };
  }
};

export const AuthInitialState = {
  userToken: null,
};
