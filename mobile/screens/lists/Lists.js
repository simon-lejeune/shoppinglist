import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, FAB, Portal, TextInput } from 'react-native-paper';

import { GetLists, CreateList } from './api';
import { ListsCards } from './components';
import Context from './context';

export const Lists = () => {
  const [loading, setLoading] = React.useState(true);
  const [lists, setLists] = React.useState([]);

  const [visible, setVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const onCreateDialog = async () => {
    setLoading(true);
    try {
      await CreateList(newListName);
      setNewListName('');
      hideDialog();
    } catch (err) {
      console.log(err);
      setLoading(false);
      return;
    }
    try {
      const res = await GetLists();
      setLists(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    GetLists()
      .then(
        (res) => {
          setLists(res.data);
        },
        (err) => {
          console.log(err);
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {loading && <ActivityIndicator animating />}
      {lists.length ? (
        <Context.Provider value={{ lists }}>
          <ListsCards />
        </Context.Provider>
      ) : null}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
