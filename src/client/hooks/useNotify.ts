import Notiflix from 'notiflix';
const timeout = 3000;

export const useNotify = ({ type, message }) => {
  if (type === 'error') {
    Notiflix.Notify.failure(message, { timeout });
  }

  if (type === 'info') {
    Notiflix.Notify.info(message, { timeout });
  }

  if (type === 'success') {
    Notiflix.Notify.success(message, { timeout });
  }

  if (type === 'warning') {
    Notiflix.Notify.warning(message, { timeout });
  }
};
