import { Error, Loading, Divider } from '@app/components';
import { useRefreshByUser } from '@app/hooks/useRefreshByUser';
import { useRefreshOnFocus } from '@app/hooks/useRefreshOnFocus';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import { Button, Dialog, FAB, Portal, TextInput, TouchableRipple } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { GetLists, DeleteList, CreateList } from './api';

export const Lists = ({ navigation }) => {
  const queryClient = useQueryClient();

  // List fetch
  const { loading, error, data, refetch } = useQuery('lists', GetLists);
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  // List deletion
  const deleteList = useMutation(DeleteList, {
    onSuccess: () => {
      queryClient.invalidateQueries(['lists']);
    },
  });
  const onDeleteList = React.useCallback(
    (listId) => {
      deleteList.mutate(listId);
    },
    [deleteList]
  );

  // List creation
  const [visible, setVisible] = React.useState(false);
  const [newListName, setNewListName] = React.useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const createList = useMutation(CreateList, {
    onSuccess: () => {
      queryClient.invalidateQueries(['lists']);
    },
  });
  const onCreateDialog = React.useCallback(() => {
    hideDialog();
    createList.mutate(newListName);
    setNewListName('');
  }, [createList]);

  // UI
  const onPressList = React.useCallback(
    (listId, listName) => {
      navigation.navigate('Items', { listId, listName });
    },
    [navigation]
  );
  const renderList = React.useCallback(
    ({ item: list }) => {
      return (
        <TouchableRipple
          onPress={() => onPressList(list.id, list.name)}
          style={styles.cardContainer}
          rippleColor="rgba(0, 0, 0, .32)"
          accessibilityRole="button">
          <View style={styles.card}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>{list.name}</Text>
            </View>
            <View style={styles.buttonsBlock}>
              <Button
                onPress={() => {
                  onDeleteList(list.id);
                }}>
                Delete
              </Button>
            </View>
          </View>
        </TouchableRipple>
      );
    },
    [onPressList, onDeleteList]
  );

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList
        data={data}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
        }
        numColumns={1}
        ItemSeparatorComponent={() => <Divider />}
      />

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
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row',
  },
  titleBlock: {
    marginTop: 'auto',
    marginBottom: 'auto',
    flex: 1,
    padding: 16,
  },
  buttonsBlock: {
    flex: 0,
    padding: 16,
  },
  title: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
