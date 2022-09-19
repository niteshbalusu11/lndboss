import { useEffect, useState } from 'react';

// Hook for validatating password strength

export const usePasswordValidation = ({ firstPassword = '', secondPassword = '', requiredLength }) => {
  const [validLength, setValidLength] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    setValidLength(firstPassword.length >= requiredLength);
    setMatch(firstPassword && firstPassword === secondPassword);
  }, [firstPassword, secondPassword, requiredLength]);

  return [validLength, match];
};
