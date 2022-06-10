import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

type Args = {
  path: string;
  query: object;
};

const axiosGet = async ({ path, query }: Args) => {
  try {
    const url = `${apiUrl}/${path}`;

    const response = await axios.get(url, {
      params: query,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { error, result } = await response.data;

    if (!!error) {
      window.alert(error);
    }
    if (!!result) {
      return result;
    }
  } catch (error) {
    window.alert(`Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`);
  }
};

export { axiosGet };
