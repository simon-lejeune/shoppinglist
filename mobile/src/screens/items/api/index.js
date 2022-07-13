import { restClient } from '@app/api';

import { ItemModel, ItemsModel } from '../models';

export const GetItems = (listId) => {
  return restClient.get(`/lists/${listId}/items/`).then((res) => {
    return ItemsModel.validate(res.data, {
      stripUnknown: true,
    });
  });
};

export const AddItem = ({ list_id, content }) => {
  return restClient.post(`/items/`, { list_id, content });
};

export const ProcessItem = ({ itemId, list_id, is_processed, content }) => {
  return restClient.put(`/items/${itemId}/`, { list_id, content, is_processed }).then((res) => {
    return ItemModel.validate(res.data, {
      stripUnknown: true,
    });
  });
};

export const DeleteItem = (itemId) => {
  return restClient.delete(`/items/${itemId}/`);
};
