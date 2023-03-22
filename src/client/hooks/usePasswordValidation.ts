import { useEffect, useState } from 'react';

// Hook for validatating password strength

export const usePasswordValidation = ({ firstPassword = '', secondPassword = '', requiredLength }) => {
  const [validLength, setValidLength] = useState(false);
  const [match, setMatch] = useState(false);

  useEffect(() => {
    setValidLength(firstPassword.length >= requiredLength);
    setMatch(!!firstPassword && firstPassword === secondPassword);
  }, [firstPassword, secondPassword, requiredLength]);

  return [validLength, match];
};
