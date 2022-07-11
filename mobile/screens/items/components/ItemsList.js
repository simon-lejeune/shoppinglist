import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, TextInput } from 'react-native-paper';

import Context from '../context';

export const ItemsList = () => {
  const { items, actions } = React.useContext(Context);
  const [newItemContent, setNewItemContent] = React.useState('');

  const onSubmit = async () => {
    if (!newItemContent) {
      return;
    }
    actions.setLoading(true);
    await actions.addItem(newItemContent);
    setNewItemContent('');
    actions.setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Add item"
        value={newItemContent}
        onSubmitEditing={() => onSubmit()}
        onChangeText={(text) => setNewItemContent(text)}
        left={<TextInput.Icon name="plus" onPress={() => onSubmit()} />}
      />

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
