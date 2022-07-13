import { Error, Loading, Divider } from '@app/components';
import { useRefreshByUser } from '@app/hooks/useRefreshByUser';
import { useRefreshOnFocus } from '@app/hooks/useRefreshOnFocus';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { FlatList, StyleSheet, View, RefreshControl, Text } from 'react-native';
import {
  Checkbox,
  TextInput,
  Portal,
  Dialog,
  TouchableRipple,
  Paragraph,
  Button,
} from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { GetItems, AddItem, DeleteItem, ProcessItem } from './api';

export const Items = ({ route, navigation }) => {
  const queryClient = useQueryClient();

  const { listId, listName } = route.params;

  React.useEffect(() => {
    if (listName) {
      navigation.setOptions({ title: `SlapList - ${listName}` });
    }
  }, [listName]);

  // Items fetch
  const { loading, error, data, refetch } = useQuery(['lists', listId, 'items'], () =>
    GetItems(listId)
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  // Item create
  const [newItemContent, setNewItemContent] = React.useState('');
  const addItem = useMutation((data) => AddItem(data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['lists', listId, 'items']);
    },
  });
  const onAddItem = React.useCallback(() => {
    addItem.mutate({ list_id: listId, content: newItemContent });
    setNewItemContent('');
  }, [listId, addItem, newItemContent]);

  // Item process
  const processItem = useMutation((data) => ProcessItem(data), {
    onSuccess: (data, variables) => {
      // TODO: improve by only using the resulting item
      //queryClient.setQueryData(['lists', listId, 'items', { id: variables.itemId }], data);
      queryClient.invalidateQueries(['lists', listId, 'items']);
    },
  });
  const onProcessItem = React.useCallback(
    (item) => {
      const { list_id, content, is_processed } = item;
      processItem.mutate({ itemId: item.id, list_id, content, is_processed: !is_processed });
    },
    [processItem]
  );

  // Item delete
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(null);
  const hideDeleteDialog = () => setDeleteDialogVisible(null);

  const deleteItem = useMutation(DeleteItem, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['lists', listId, 'items']);
    },
  });
  const onDeleteItem = React.useCallback(
    (itemId) => {
      deleteItem.mutate(itemId);
      hideDeleteDialog();
    },
    [deleteItem]
  );

  // UI
  const renderItem = React.useCallback(
    ({ item }) => {
      return (
        <TouchableRipple
          style={styles.card}
          onPress={() => {}}
          onLongPress={() => setDeleteDialogVisible(item.id)}
          rippleColor="rgba(0, 0, 0, .32)"
          accessibilityRole="button">
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Text style={styles.content}>{item.content}</Text>
            </View>
            <View style={styles.cardProcess}>
              <Checkbox
                status={item.is_processed ? 'checked' : 'unchecked'}
                onPress={() => {
                  onProcessItem(item);
                }}
              />
            </View>
          </View>
        </TouchableRipple>
      );
    },
    [onProcessItem, onDeleteItem]
  );
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        label="Add item"
        value={newItemContent}
        onSubmitEditing={() => onAddItem()}
        onChangeText={(text) => setNewItemContent(text)}
        left={<TextInput.Icon name="plus" onPress={() => onAddItem()} />}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetchingByUser} onRefresh={refetchByUser} />
        }
        numColumns={1}
        ItemSeparatorComponent={() => <Divider />}
      />

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Delete an item</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Please confirm the deletion</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={hideDeleteDialog}>
              Cancel
            </Button>
            <Button mode="contained" onPress={() => onDeleteItem(deleteDialogVisible)}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
  },
  cardContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
  },
  content: {
    fontSize: 18,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  cardProcess: {
    flex: 0,
    minWidth: '10%',
  },
});
