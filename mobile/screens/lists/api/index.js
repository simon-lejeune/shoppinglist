import { restClient } from '../../../api';

export const GetLists = (signal) => {
  return restClient.get('/lists/', { signal });
};

export const CreateList = (name) => {
  return restClient.post('/lists/', { name });
};
