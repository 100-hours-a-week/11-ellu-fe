import { useState, useCallback } from 'react';
import { validationRules, ValidationResult } from '@/utils/validateRules';
export interface ValidationErrors {
  [fieldName: string]: string;
}

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 필드 유효성 검사
  const validateField = useCallback(
    (fieldName: string, value: string, ruleName: keyof typeof validationRules): boolean => {
      const result = validationRules[ruleName](value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: result.message, // 필드별로 에러 저장
      }));
      return result.isValid;
    },
    []
  );

  // 에러 메시지 수동설정
  const setError = useCallback((fieldName: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: message,
    }));
  }, []);

  const hasErrors = useCallback(() => {
    return Object.values(errors).some((error) => error !== '');
  }, [errors]);

  return {
    errors,
    validateField,
    setError,
    hasErrors,
  };
};
