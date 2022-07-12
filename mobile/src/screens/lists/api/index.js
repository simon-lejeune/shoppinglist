import { restClient } from '@app/api';

export const GetLists = (signal) => {
  return restClient.get('/lists/', { signal });
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
