import Notiflix from 'notiflix';
const timeout = 3000;

// Hook for all pop-up notifications in the app.

export const useNotify = ({ type, message }) => {
  Notiflix.Notify.init({
    fontSize: '14px',
    success: {
      background: '#049451',
      textColor: '#fff',
      childClassName: 'notiflix-notify-success',
      notiflixIconColor: 'rgba(0,0,0,0.2)',
      fontAwesomeClassName: 'fas fa-check-circle',
      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
      backOverlayColor: 'rgba(50,198,130,0.2)',
    },
    failure: {
      background: '#ff5549',
      textColor: '#fff',
      childClassName: 'notiflix-notify-failure',
      notiflixIconColor: 'rgba(0,0,0,0.2)',
      fontAwesomeClassName: 'fas fa-times-circle',
      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
      backOverlayColor: 'rgba(255,85,73,0.2)',
    },
    warning: {
      background: '#eebf31',
      textColor: '#fff',
      childClassName: 'notiflix-notify-warning',
      notiflixIconColor: 'rgba(0,0,0,0.2)',
      fontAwesomeClassName: 'fas fa-exclamation-circle',
      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
      backOverlayColor: 'rgba(238,191,49,0.2)',
    },
    info: {
      background: '#134ad6',
      textColor: '#fff',
      childClassName: 'notiflix-notify-info',
      notiflixIconColor: 'rgba(0,0,0,0.2)',
      fontAwesomeClassName: 'fas fa-info-circle',
      fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
      backOverlayColor: 'rgba(38,192,211,0.2)',
    },
  });

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
