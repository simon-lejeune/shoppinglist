import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ValidationError } from 'yup';

import { ListModel } from '../lists/models';
import { GetList, GetItems, AddItem } from './api';
import { ItemsList } from './components';
import Context from './context';
import { ItemsModel } from './models';

export const Items = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState([]);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (listName) {
      navigation.setOptions({ title: listName });
    }
  }, [listName]);

  const getList = async (listId, signal) => {
    let newList = null;
    try {
      const listRaw = await GetList(listId, signal);
      newList = await ListModel.validate(listRaw.data, {
        stripUnknown: true,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('response data invalid');
      } else {
        console.log(err);
      }
      setList(newList);
    }
  };

  const getItems = async (listId, signal) => {
    let newItems = [];
    try {
      const itemsRaw = await GetItems(listId, signal);
      newItems = await ItemsModel.validate(itemsRaw.data, {
        stripUnknown: true,
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('response data invalid');
      } else {
        console.log(err);
      }
    } finally {
      setItems(newItems);
    }
  };

  const addItem = async (content) => {
    try {
      await AddItem(listId, content);
    } catch (err) {
      console.log(err);
    }
    await getItems(listId);
  };

  // React.useEffect(() => {
  //   // eslint-disable-next-line no-undef
  //   const abortController = new AbortController();
  //   const signal = abortController.signal;
  //   (async function fetchData() {
  //     setLoading(true);
  //     await getList(listId, signal);
  //     setLoading(false);
  //   })();
  //   return () => {
  //     abortController.abort();
  //   };
  // }, [listId]);

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    const abortController = new AbortController();
    const signal = abortController.signal;
    (async function fetchData() {
      setLoading(true);
      await getItems(listId, signal);
      setLoading(false);
    })();
    return () => {
      abortController.abort();
    };
  }, [listId]);

  const context = {
    list,
    items,
    actions: {
      getList,
      getItems,
      addItem,
      setLoading,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Context.Provider value={context}>
        <ItemsList />
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
