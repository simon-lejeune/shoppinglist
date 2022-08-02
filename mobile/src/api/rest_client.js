import { API_URL } from '@app/config';

import axios from 'axios';

export const restClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});
