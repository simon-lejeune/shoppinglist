import { restClient } from '../../../api';

export const GetLists = () => {
  return restClient.get('/lists/');
};

export const CreateList = (name) => {
  return restClient.post('/lists/', { name });
};
