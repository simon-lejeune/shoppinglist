import { restClient } from '@app/api';

import { ListsModel } from '../models';

export const GetLists = () => {
  return restClient.get('/lists/').then((res) => {
    return ListsModel.validate(res.data, { stripUnknown: true });
  });
};

export const CreateList = (name) => {
  return restClient.post('/lists/', { name });
};

export const DeleteList = (listId) => {
  return restClient.delete(`/lists/${listId}/`);
};

export const GetItems = (listId) => {
  return restClient.get(`/lists/${listId}/items/`);
};
