import Notiflix from 'notiflix';

// Adds a loading indicator to pages when waiting for a response from the server

type Args = {
  isLoading: boolean;
};

export const useLoading = ({ isLoading }: Args) => {
  if (!!isLoading) {
    Notiflix.Loading.dots('Loading...');
  }

  if (!isLoading) {
    Notiflix.Loading.remove();
  }
};
