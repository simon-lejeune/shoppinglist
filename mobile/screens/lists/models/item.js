import { array, object, bool, string, date, number } from 'yup';

export const ItemModel = object({
  id: number().required(),
  list_id: number().required(),
  content: string().required(),
  is_processed: bool().required(),
  created_at: date().required(),
  updated_at: date().required(),
});

export const ItemsModel = array().of(ItemModel);
