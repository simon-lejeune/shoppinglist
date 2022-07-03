import { restClient } from '../../../api';

export const GetLists = () => {
  return restClient.get("/lists/");
};

export const CreateList = (name) => {
  //const data = {
  //  data: {
  //    name
  //  }
  //};
  //return restClient.post("/lists/", data);
  return restClient.post("/lists/", { name });
};
