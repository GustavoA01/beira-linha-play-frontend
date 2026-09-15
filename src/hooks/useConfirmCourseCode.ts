import { useEffect, useState } from 'react';

export const useConfirmCourseCode = (open: boolean, expectedCode: string) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) return;
    setCode('');
    setError('');
  }, [open]);

  const matches = (value: string) => {
    const expected = expectedCode.trim();
    return (
      expected.length > 0 &&
      value.trim().toLowerCase() === expected.toLowerCase()
    );
  };

  const onCodeChange = (value: string) => {
    setCode(value);
    setError('');
  };

  const confirmIfMatches = (onConfirm: () => void) => {
    if (!matches(code)) {
      setError('O código do curso não confere');
      return;
    }
    onConfirm();
  };

  return { code, error, onCodeChange, confirmIfMatches };
};
