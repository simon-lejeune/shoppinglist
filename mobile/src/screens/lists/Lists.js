import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { ValidationError } from 'yup';

import { GetLists, CreateList, DeleteList } from './api';
import { AddList, ListsCards } from './components';
import Context from './context';
import { ListsModel } from './models';

export const Lists = ({ navigation }) => {
  const [loading, setLoading] = React.useState(true);
  const [lists, setLists] = React.useState([]);
  const navigateToItems = (listId, listName) => {
    return navigation.navigate('Items', { listId, listName });
  };

  const refreshLists = async (signal) => {
    let newLists = [];
    try {
      const listsRaw = await GetLists(signal);
      newLists = await ListsModel.validate(listsRaw.data, {
        stripUnknown: true,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('response data invalid');
        setError(err.message);
      } else {
        console.log(err);
        setError(err.message);
      }
    } finally {
      setLists(newLists);
    }
    return newLists;
  };

  const deleteList = async (listId) => {
    try {
      await DeleteList(listId);
      await refreshLists();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const addList = async (listName) => {
    let newListId;
    let newLists = [];
    try {
      const newListRaw = await CreateList(listName);
      newListId = newListRaw.data.id;
      newLists = await refreshLists();
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
    if (newListId) {
      const l = newLists.find((l) => l.id === newListId);
      return l;
    }
    return null;
  };

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    const abortController = new AbortController();
    const signal = abortController.signal;
    (async function fetchData() {
      setLoading(true);
      await refreshLists(signal);
      setLoading(false);
    })();
    return () => {
      abortController.abort();
    };
  }, []);

  const context = {
    lists,
    actions: {
      navigateToItems,
      refreshLists,
      addList,
      deleteList,
      setLoading,
    },
  };

  // tmp: error snack bar
  // need to do much better here
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState('');
  const onDismissSnackBar = () => {
    setVisible(false);
    setError('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Snackbar
        visible={visible || error}
        onDismiss={onDismissSnackBar}
        theme={{
          colors: {
            surface: 'red',
            background: 'white',
            backdrop: 'white',
            primary: 'white',
            accent: 'white',
          },
        }}>
        {error}
      </Snackbar>

      <Context.Provider value={context}>
        <ListsCards />
        <AddList />
      </Context.Provider>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator animating size="large" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    backgroundColor: 'black',
  },
});
