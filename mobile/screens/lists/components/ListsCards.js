import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Context from '../context';

export const ListsCards = () => {
  const { lists } = React.useContext(Context);

  return (
    <View style={styles.container}>
      {lists.map(({ name }) => (
        <Text key={name}>{name}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
