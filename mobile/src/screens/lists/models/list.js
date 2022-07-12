import { array, object, string, date, number } from 'yup';

export const ListModel = object({
  id: number().required(),
  name: string().required(),
  created_at: date().required(),
  updated_at: date().required(),
});

export const ListsModel = array().of(ListModel);
