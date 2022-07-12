import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, FAB, Portal, TextInput } from 'react-native-paper';

import Context from '../context';

export const AddList = () => {
  const { actions } = React.useContext(Context);

  const [visible, setVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const onCreateDialog = async () => {
    actions.setLoading(true);
    hideDialog();
    const newList = await actions.addList(newListName);
    setNewListName('');
    actions.setLoading(false);
    // missing handling of error
    //
    actions.navigateToItems(newList.id, newList.name);
  };

  return (
    <View>
      <FAB icon="plus" style={styles.fab} onPress={showDialog} />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Create a list</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="my list name"
              value={newListName}
              onChangeText={(text) => setNewListName(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onCreateDialog}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
