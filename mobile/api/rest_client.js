import axios from 'axios';

import { API_URL } from '../config';

export const restClient = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});
