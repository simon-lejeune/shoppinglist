import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';

import { GetLists, CreateList } from './api';
import Context from './context';
import { ListsCards } from './components'

export const Lists = () => {
  const [loading, setLoading] = React.useState(true);
  const [lists, setLists] = React.useState([]);

  const [visible, setVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState("");
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const onCreateDialog = async () => {
    setLoading(true);
    try {
      await CreateList(newListName);
      setNewListName("");
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
      .then((res) => {
        setLists(res.data);
      }, (err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        {loading && <ActivityIndicator animating={true} />}
        {lists.length ? (
          <Context.Provider value={{ lists }}>
            <ListsCards/>
          </Context.Provider>
        ) : null}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={showDialog}
          />
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Create a list</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="my list name"
                value={newListName}
                onChangeText={text => setNewListName(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onCreateDialog}>Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  );
}

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
