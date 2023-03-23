import * as YAML from 'json-to-pretty-yaml';

import axios from 'axios';
import { getAuthenticatedCookie } from './cookie';
import { io } from 'socket.io-client';
import { useLoading } from '~client/hooks/useLoading';
import { useNotify } from '~client/hooks/useNotify';

const apiUrl = `${process.env.BASE_PATH || ''}/api`;

const abortedErrorCode = 'ECONNABORTED';

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
    useLoading({ isLoading: true });

    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

    const response = await axios.get(url, {
      params: query,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { result } = await response.data;

    useLoading({ isLoading: false });

    if (!!result) {
      return result;
    }
  } catch (error) {
    useLoading({ isLoading: false });
    useNotify({
      type: 'error',
      message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
    });
  }
};

const axiosGetNoLoading = async ({ path, query }: ArgsGet) => {
  try {
    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

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
    if (error.code === abortedErrorCode) {
      return;
    }

    useNotify({
      type: 'error',
      message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
    });
  }
};

const axiosGetNoAlert = async ({ path, query }: ArgsGet) => {
  try {
    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

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
    // Ignore errors
  }
};

const axiosGetWebSocket = async ({ path, query }: ArgsGet) => {
  try {
    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

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

const axiosPostWithAlert = async ({ path, postBody }: ArgsPost) => {
  try {
    useLoading({ isLoading: true });

    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await axios.post(url, postBody, config);

    const data = await response.data;

    useLoading({ isLoading: false });
    return data;
  } catch (error) {
    useLoading({ isLoading: false });
    useNotify({
      type: 'error',
      message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
    });
  }
};

const axiosPost = async ({ path, postBody }: ArgsPost) => {
  try {
    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await axios.post(url, postBody, config);

    const data = await response.data;

    return data;
  } catch (error) {
    console.log(error);
  }
};

const axiosPostWithWebSocket = async ({ id, path, postBody, setData }) => {
  try {
    const socket = io();
    const output = [];

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(`${id}`, data => {
      const message = data.message.options;

      output.push(YAML.stringify(message));

      setData(output.join('\n'));
    });

    socket.on('error', err => {
      throw err;
    });

    const url = `${apiUrl}/${path}`;
    const accessToken = getAuthenticatedCookie();

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const response = await axios.post(url, postBody, config);

    const data = await response.data;

    output.push(YAML.stringify(data));

    setData(output.join('\n'));

    return data;
  } catch (error) {
    useNotify({
      type: 'error',
      message: `Status: ${error.response.data.statusCode}\nMessage: ${error.response.data.message}`,
    });
  }
};

export {
  axiosGet,
  axiosGetNoAlert,
  axiosGetNoLoading,
  axiosGetWebSocket,
  axiosPost,
  axiosPostWithAlert,
  axiosPostWithWebSocket,
};
