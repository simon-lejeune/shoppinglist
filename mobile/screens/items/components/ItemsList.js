import * as React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { List } from 'react-native-paper';

import Context from '../context';

export const ItemsList = () => {
  const { items, actions } = React.useContext(Context);

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <List.Item key={item.id} title={item.content} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
});
