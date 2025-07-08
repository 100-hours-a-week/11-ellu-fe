export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// 기본 유효성 검사 규칙들
export const validationRules = {
  scheduleTitle: (value: string): ValidationResult => {
    if (!value || value.length < 1) {
      return { isValid: false, message: '제목을 입력해주세요.' };
    }
    if (value.length > 30) {
      return { isValid: false, message: '제목은 30자 이하여야 합니다.' };
    }
    return { isValid: true, message: '' };
  },

  scheduleDescription: (value: string): ValidationResult => {
    if (value && value.length > 100) {
      return { isValid: false, message: '할일은 100자 이하여야 합니다.' };
    }
    return { isValid: true, message: '' };
  },

  projectTitle: (value: string): ValidationResult => {
    if (!value || value.length < 1 || value.length > 10) {
      return { isValid: false, message: '최소 1자, 최대 10자이내로 입력해주세요' };
    }
    if (!/^[가-힣a-zA-Z0-9\s]+$/.test(value)) {
      return { isValid: false, message: '한글, 영문, 숫자만 입력 가능합니다' };
    }
    return { isValid: true, message: '' };
  },

  url: (value: string): ValidationResult => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(value)) {
      return { isValid: false, message: '올바른 URL 형식이 아닙니다' };
    }
    return { isValid: true, message: '' };
  },

  nickname: (value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, message: '닉네임을 입력해주세요.' };
    }
    if (value.length > 10) {
      return { isValid: false, message: '닉네임은 최대 10자까지 가능합니다.' };
    }
    const nicknameRegex = /^[a-zA-Z0-9가-힣._]{1,10}$/;
    if (!nicknameRegex.test(value)) {
      return { isValid: false, message: '닉네임은 . , _ 를 포함한 한글, 영문 또는 숫자만 사용할 수 있습니다.' };
    }
    return { isValid: true, message: '' };
  },

  // 필수 필드 검증
  required: (value: string, fieldName: string = '값'): ValidationResult => {
    if (!value || value.trim() === '') {
      return { isValid: false, message: `${fieldName}을(를) 입력해주세요.` };
    }
    return { isValid: true, message: '' };
  },
};
