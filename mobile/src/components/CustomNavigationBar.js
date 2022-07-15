import { AuthContext } from '@app/context';
import * as React from 'react';
import { Appbar, Menu } from 'react-native-paper';

export const CustomNavigationBar = ({ navigation, back }) => {
  const { state, signOut } = React.useContext(AuthContext);

  const [accountMenuVisible, setAccountMenuVisible] = React.useState(false);
  const openAccountMenu = () => setAccountMenuVisible(true);
  const closeAccountMenu = () => setAccountMenuVisible(false);

  const onPressLogOut = async () => {
    signOut();
    closeAccountMenu();
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="SlapList" />
      {state.userToken !== null ? (
        <Menu
          visible={accountMenuVisible}
          onDismiss={closeAccountMenu}
          anchor={<Appbar.Action icon="menu" color="white" onPress={openAccountMenu} />}>
          <Menu.Item onPress={onPressLogOut} title="Log out" />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
};
