import axios from 'axios';
import getConfig from 'next/config';
import { useNotify } from '~client/hooks/useNotify';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type ArgsGet = {
  path: string;
  query: object;
};

type ArgsPost = {
  path: string;
  postBody: object;
};

const axiosGet = async ({ path, query }: ArgsGet) => {
  try {
    const url = `${apiUrl}/${path}`;
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(url, {
      params: query,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { result } = await response.data;

    if (!!result) {
      return result;
    }
  } catch (error) {
    useNotify({
      type: 'error',
      message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
    });
  }
};

const axiosPost = async ({ path, postBody }: ArgsPost) => {
  try {
    const url = `${apiUrl}/${path}`;

    const response = await axios.post(url, {
      headers: { 'Content-Type': 'application/json' },
      postBody,
    });

    const data = await response.data;

    return data;
  } catch (error) {
    window.alert(`Status: ${error.response.status}\nMessage: ${error.response.data.message}`);
  }
};

export { axiosGet, axiosPost };
