import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, FAB, Portal, TextInput } from 'react-native-paper';
import { ValidationError } from 'yup';

import { GetLists, CreateList } from './api';
import { ListsCards } from './components';
import Context from './context';
import { ListsModel } from './models';

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
      const listsRaw = await GetLists();
      const lists = await ListsModel.validate(listsRaw.data, {
        stripUnknown: true,
      });
      setLists(lists);
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('response data invalid');
      } else {
        console.log(err);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    const abortController = new AbortController();
    const signal = abortController.signal;
    (async function fetchData() {
      try {
        const listsRaw = await GetLists(signal);
        const lists = await ListsModel.validate(listsRaw.data, {
          stripUnknown: true,
        });
        setLists(lists);
      } catch (err) {
        if (err instanceof ValidationError) {
          console.log('yup error');
        } else {
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      abortController.abort();
    };
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
