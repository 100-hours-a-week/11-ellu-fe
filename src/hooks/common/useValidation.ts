import { useState, useCallback } from 'react';
import { validationRules, ValidationResult } from '@/utils/validateRules';

export const useValidation = () => {
  const [errors, setErrors] = useState('');

  // 필드 유효성 검사
  const validateField = useCallback((value: string, ruleName: keyof typeof validationRules): boolean => {
    const result = validationRules[ruleName](value);
    setErrors(result.message);
    return result.isValid;
  }, []);

  // 에러 메시지 수동설정
  const setError = useCallback((message: string) => {
    setErrors(message);
  }, []);

  return {
    errors,
    validateField,
    setError,
  };
};
