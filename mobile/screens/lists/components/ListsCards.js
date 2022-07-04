import * as React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, Card, Paragraph } from 'react-native-paper';

import Context from '../context';

export const ListsCards = () => {
  const { lists, actions } = React.useContext(Context);

  const onDeleteList = async (listId) => {
    actions.setLoading(true);
    await actions.deleteList(listId);
    actions.setLoading(false);
  };

  const renderList = ({ item: list }) => {
    return (
      <Card style={styles.card}>
        <Card.Title title={list.name} />
        <Card.Content>
          <Paragraph>x items</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => {
              onDeleteList(list.id);
            }}>
            Delete
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(item) => item.id}
        numColumns="2"
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: 'lightblue',
  },
});
