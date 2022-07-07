import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
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
      } else {
        console.log(err);
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

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
