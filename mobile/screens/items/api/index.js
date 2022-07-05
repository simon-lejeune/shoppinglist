import { restClient } from '../../../api';

export const GetList = (listId, signal) => {
  return restClient.get(`/lists/${listId}/`, { signal });
};

export const GetItems = (listId, signal) => {
  return restClient.get(`/lists/${listId}/items/`, { signal });
};
